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
import VersionsSidebarAPI from './VersionsSidebarAPI';
import { withAPIContext } from '../../common/api-context';
import type { VersionActionCallback, VersionChangeCallback } from './flowTypes';
import { ERROR_CODE_FETCH_VERSION } from '../../../constants';

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

    api: VersionsSidebarAPI;

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
        this.initialize();
        this.fetchData();
    }

    componentDidUpdate({ fileId: prevFileId, versionId: prevVersionId }: Props) {
        const { fileId, versionId } = this.props;

        if (fileId !== prevFileId) {
            this.refresh();
        }

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

        return this.api
            .deleteVersion(this.findVersion(versionId))
            .then(() => this.api.fetchVersion(versionId))
            .then(this.mergeResponse)
            .then(() => this.handleDeleteSuccess(versionId))
            .then(() => this.props.onVersionDelete(versionId))
            .catch(() => this.handleActionError(messages.versionActionDeleteError));
    };

    handleActionDownload = (versionId: string): Promise<void> => {
        return this.api
            .fetchDownloadUrl(this.findVersion(versionId))
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

        return this.api
            .promoteVersion(this.findVersion(versionId))
            .then(this.api.fetchData)
            .then(this.handleFetchSuccess)
            .then(this.handlePromoteSuccess)
            .then(() => this.props.onVersionPromote(versionId))
            .catch(() => this.handleActionError(messages.versionActionPromoteError));
    };

    handleActionRestore = (versionId: string): Promise<void> => {
        this.setState({ isLoading: true });

        return this.api
            .restoreVersion(this.findVersion(versionId))
            .then(this.mergeResponse)
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
        const versionsWithPermissions = api.getVersionsAPI(false).addPermissions(versionsResponse, fileResponse) || {};
        const { entries: versions, total_count: versionCount } = versionsWithPermissions;

        this.setState(
            {
                error: undefined,
                isLoading: false,
                isWatermarked,
                versionCount,
                versionLimit,
                versions: this.sortVersions(versions),
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

    initialize = (): void => {
        this.api = new VersionsSidebarAPI(this.props);
    };

    fetchData = (): void => {
        this.api
            .fetchData()
            .then(this.handleFetchSuccess)
            .catch(this.handleFetchError);
    };

    findVersion = (versionId: ?string): ?BoxItemVersion => {
        const { versions } = this.state;

        return versions.find(version => version.id === versionId);
    };

    getCurrentVersionId = (): ?string => {
        const { versions } = this.state;
        return versions[0] ? versions[0].id : null;
    };

    mergeResponse = (data: BoxItemVersion) => {
        const { versions } = this.state;
        const { id: versionId } = data;

        if (!versionId) {
            return Promise.reject(ERROR_CODE_FETCH_VERSION);
        }

        const newVersions = JSON.parse(JSON.stringify(versions)).map(version => {
            if (version.id !== versionId) {
                return version;
            }
            return Object.assign(version, data);
        });

        this.setState({
            error: undefined,
            isLoading: false,
            versions: newVersions,
        });

        return Promise.resolve();
    };

    refresh(): void {
        this.initialize();
        this.setState({ isLoading: true }, this.fetchData);
    }

    sortVersions(versions?: Array<BoxItemVersion> = []): Array<BoxItemVersion> {
        return [...versions].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    }

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
