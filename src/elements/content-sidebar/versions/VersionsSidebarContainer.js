/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { generatePath, withRouter } from 'react-router-dom';
import type { Match, RouterHistory } from 'react-router-dom';
import type { MessageDescriptor } from 'react-intl';
import API from '../../../api';
import messages from './messages';
import openUrlInsideIframe from '../../../utils/iframe';
import VersionsSidebar from './VersionsSidebar';
import { FILE_VERSION_FIELDS_TO_FETCH } from '../../../utils/fields';
import { withAPIContext } from '../../common/api-context';
import type { VersionActionCallback, VersionChangeCallback } from './flowTypes';

type Props = {
    api: API,
    fileId: string,
    history: RouterHistory,
    match: Match,
    onVersionChange: VersionChangeCallback,
    onVersionDelete: VersionActionCallback,
    onVersionDownload: VersionActionCallback,
    onVersionPreview: VersionActionCallback,
    onVersionPromote: VersionActionCallback,
    onVersionRestore: VersionActionCallback,
    parentName: string,
    versionId?: string,
};

type State = {
    error?: MessageDescriptor,
    isLoading: boolean,
    isWatermarked: boolean,
    versionCount: number,
    versionLimit: number,
    versions: Array<BoxItemVersion>,
};

class VersionsSidebarContainer extends React.Component<Props, State> {
    static defaultProps = {
        onVersionChange: noop,
        onVersionDelete: noop,
        onVersionDownload: noop,
        onVersionPreview: noop,
        onVersionPromote: noop,
        onVersionRestore: noop,
        parentName: '',
    };

    props: Props;

    state: State = {
        isLoading: true,
        isWatermarked: false,
        versionCount: Infinity,
        versionLimit: Infinity,
        versions: [],
    };

    window: any = window;

    componentDidMount() {
        this.fetchData().catch(this.handleFetchError);
    }

    componentDidUpdate({ versionId: prevVersionId }: Props) {
        const { versionId } = this.props;

        if (versionId !== prevVersionId) {
            this.verifyVersion();
        }
    }

    componentWillUnmount() {
        // Reset the current version id since the wrapping route is no longer active
        this.props.onVersionChange(null);
    }

    handleActionDelete = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.deleteVersion(versionId)
            .then(this.fetchData)
            .then(() => this.handleDeleteSuccess(versionId))
            .then(() => this.props.onVersionDelete(versionId))
            .catch(() => this.handleActionError(messages.versionActionDeleteError));
    };

    handleActionDownload = (versionId: string): Promise<void> => {
        return this.fetchDownloadUrl(versionId)
            .then(openUrlInsideIframe)
            .then(() => this.props.onVersionDownload(versionId))
            .catch(() => this.handleActionError(messages.versionActionDownloadError));
    };

    handleActionPreview = (versionId: string): void => {
        this.updateVersion(versionId);
        this.props.onVersionPreview(versionId);
    };

    handleActionPromote = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.promoteVersion(versionId)
            .then(this.fetchData)
            .then(this.handlePromoteSuccess)
            .then(() => this.props.onVersionPromote(versionId))
            .catch(() => this.handleActionError(messages.versionActionPromoteError));
    };

    handleActionRestore = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.restoreVersion(versionId)
            .then(this.fetchData)
            .then(() => this.props.onVersionRestore(versionId))
            .catch(() => this.handleActionError(messages.versionActionRestoreError));
    };

    handleActionError = (message: MessageDescriptor): void => {
        this.setState({
            error: message,
            isLoading: false,
        });
    };

    handleDeleteSuccess = (versionId: string) => {
        const { versionId: selectedVersionId } = this.props;

        // Bump the user to the current version if they deleted their selected version
        if (versionId === selectedVersionId) {
            this.updateVersionToCurrent();
        }
    };

    handleFetchError = (): void => {
        this.setState({
            error: messages.versionFetchError,
            isLoading: false,
            isWatermarked: false,
            versionCount: 0,
            versions: [],
        });
    };

    handleFetchSuccess = ([fileResponse, versionsResponse]): [BoxItem, FileVersions] => {
        const { api } = this.props;
        const { version_limit } = fileResponse;
        const isWatermarked = getProp(fileResponse, 'watermark_info.is_watermarked', false);
        const versionLimit = version_limit !== null && version_limit !== undefined ? version_limit : Infinity;
        const versionsApi = api.getVersionsAPI(false);
        const versionsWithPermissions = versionsApi.addPermissions(versionsResponse, fileResponse);
        const { entries: versions, total_count: totalCount } = versionsApi.sortVersions(versionsWithPermissions) || {};

        this.setState(
            {
                error: undefined,
                isLoading: false,
                isWatermarked,
                versionCount: totalCount,
                versionLimit,
                versions,
            },
            this.verifyVersion,
        );

        return [fileResponse, versionsResponse];
    };

    handlePromoteSuccess = ([file]: [BoxItem, FileVersions]): void => {
        const { file_version: fileVersion } = file;

        if (fileVersion) {
            this.updateVersion(fileVersion.id);
        }
    };

    fetchData = (): Promise<any> => {
        return Promise.all([this.fetchFile(), this.fetchVersions()])
            .then(this.fetchVersionCurrent)
            .then(this.handleFetchSuccess);
    };

    fetchDownloadUrl = (versionId: string): Promise<string> => {
        const { api, fileId } = this.props;
        const version = this.findVersion(versionId);

        if (!version) {
            return Promise.reject(new Error('Could not find requested version'));
        }

        return new Promise((resolve, reject) => {
            api.getFileAPI().getDownloadUrl(fileId, version, resolve, reject);
        });
    };

    fetchFile = (options = {}): Promise<BoxItem> => {
        const { api, fileId } = this.props;

        return new Promise((resolve, reject) =>
            api.getFileAPI().getFile(fileId, resolve, reject, {
                fields: FILE_VERSION_FIELDS_TO_FETCH,
                forceFetch: true,
                ...options,
            }),
        );
    };

    fetchVersions = (): Promise<FileVersions> => {
        const { api, fileId } = this.props;

        return new Promise((resolve, reject) => api.getVersionsAPI(false).getVersions(fileId, resolve, reject));
    };

    fetchVersionCurrent = ([fileResponse, versionsResponse]): Promise<[BoxItem, FileVersions]> => {
        const { api, fileId } = this.props;
        const { file_version = {} } = fileResponse;

        return new Promise((resolve, reject) =>
            api.getVersionsAPI(false).getCurrentVersion(
                fileId,
                file_version.id,
                (currentVersionResponse: BoxItemVersion) => {
                    resolve([
                        fileResponse,
                        api
                            .getVersionsAPI(false)
                            .addCurrentVersion(currentVersionResponse, versionsResponse, fileResponse),
                    ]);
                },
                reject,
            ),
        );
    };

    findVersion = (versionId: ?string): ?BoxItemVersion => {
        const { versions } = this.state;

        return versions.find(version => version.id === versionId);
    };

    getCurrentVersionId = (): ?string => {
        const { versions } = this.state;
        return versions[0] ? versions[0].id : null;
    };

    deleteVersion = (versionId: string): Promise<null> => {
        const { api, fileId } = this.props;
        const { permissions = {} } = this.findVersion(versionId) || {};

        return new Promise((successCallback, errorCallback) =>
            api.getVersionsAPI(false).deleteVersion({
                fileId,
                permissions,
                successCallback,
                errorCallback,
                versionId,
            }),
        );
    };

    promoteVersion = (versionId: string): Promise<BoxItemVersion> => {
        const { api, fileId } = this.props;
        const { permissions = {} } = this.findVersion(versionId) || {};

        return new Promise((successCallback, errorCallback) =>
            api.getVersionsAPI(false).promoteVersion({
                fileId,
                permissions,
                successCallback,
                errorCallback,
                versionId,
            }),
        );
    };

    restoreVersion = (versionId: string): Promise<any> => {
        const { api, fileId } = this.props;
        const { permissions = {} } = this.findVersion(versionId) || {};

        return new Promise((successCallback, errorCallback) =>
            api.getVersionsAPI(false).restoreVersion({
                fileId,
                permissions,
                successCallback,
                errorCallback,
                versionId,
            }),
        );
    };

    updateVersion = (versionId?: ?string): void => {
        const { history, match } = this.props;
        return history.push(generatePath(match.path, { ...match.params, versionId }));
    };

    updateVersionToCurrent = (): void => {
        this.updateVersion(this.getCurrentVersionId());
    };

    verifyVersion = () => {
        const { onVersionChange, versionId } = this.props;
        const selectedVersion = this.findVersion(versionId);

        if (selectedVersion) {
            onVersionChange(selectedVersion, {
                currentVersionId: this.getCurrentVersionId(),
                updateVersionToCurrent: this.updateVersionToCurrent,
            });
        } else {
            this.updateVersionToCurrent();
        }
    };

    render() {
        const { fileId, parentName } = this.props;

        return (
            <VersionsSidebar
                fileId={fileId}
                onDelete={this.handleActionDelete}
                onDownload={this.handleActionDownload}
                onPreview={this.handleActionPreview}
                onPromote={this.handleActionPromote}
                onRestore={this.handleActionRestore}
                parentName={parentName}
                {...this.state}
            />
        );
    }
}

export type VersionsSidebarProps = Props;
export default flow([withRouter, withAPIContext])(VersionsSidebarContainer);
