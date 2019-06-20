/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import React from 'react';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import { generatePath, withRouter } from 'react-router-dom';
import type { Match, RouterHistory } from 'react-router-dom';
import API from '../../../api';
import openUrlInsideIframe from '../../../utils/iframe';
import VersionsSidebar from './VersionsSidebar';
import { FILE_VERSION_FIELDS_TO_FETCH } from '../../../utils/fields';
import { withAPIContext } from '../../common/api-context';

type Props = {
    api: API,
    fileId: string,
    history: RouterHistory,
    match: Match,
    onVersionChange: OnVersionChange,
    parentName: string,
    versionId?: string,
};

type State = {
    error?: string,
    isLoading: boolean,
    versions: Array<BoxItemVersion>,
};

class VersionsSidebarContainer extends React.Component<Props, State> {
    static defaultProps = {
        onVersionChange: noop,
        parentName: '',
    };

    props: Props;

    state: State = {
        isLoading: true,
        versions: [],
    };

    componentDidMount() {
        this.fetchData();
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

    handleActionDelete = (versionId: string): void => {
        this.setState({ isLoading: true }, () => {
            this.deleteVersion(versionId)
                .then(this.fetchData)
                .then(() => this.handleDeleteSuccess(versionId))
                .catch(this.handleActionError);
        });
    };

    handleActionDownload = (versionId: string): void => {
        this.fetchDownloadUrl(versionId)
            .then(openUrlInsideIframe)
            .catch(this.handleActionError);
    };

    handleActionError = ({ message }: ElementsXhrError): void => {
        this.setState({
            error: message,
            isLoading: false,
        });
    };

    handleActionPreview = (versionId: string): void => {
        this.updateVersion(versionId);
    };

    handleActionPromote = (versionId: string): void => {
        this.setState({ isLoading: true }, () => {
            this.promoteVersion(versionId)
                .then(this.fetchData)
                .then(this.handlePromoteSuccess)
                .catch(this.handleActionError);
        });
    };

    handleActionRestore = (versionId: string): void => {
        this.setState({ isLoading: true }, () => {
            this.restoreVersion(versionId)
                .then(this.fetchData)
                .catch(this.handleActionError);
        });
    };

    handleDeleteSuccess = (versionId: string) => {
        const { versionId: selectedVersionId } = this.props;

        // Bump the user to the current version if they deleted their selected version
        if (versionId === selectedVersionId) {
            this.updateVersionToCurrent();
        }
    };

    handleFetchError = ({ message }: ElementsXhrError): void => {
        this.setState({
            error: message,
            isLoading: false,
            versions: [],
        });
    };

    handleFetchSuccess = ([fileResponse, versionsResponse]): [BoxItem, FileVersions] => {
        const { api } = this.props;
        const versionsApi = api.getVersionsAPI(false);
        const versionsWithPermissions = versionsApi.addPermissions(versionsResponse, fileResponse);
        const { entries: versions } = versionsApi.sortVersions(versionsWithPermissions) || {};

        this.setState(
            {
                error: undefined,
                isLoading: false,
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
            .then(this.handleFetchSuccess)
            .catch(this.handleFetchError);
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

export default flow([withRouter, withAPIContext])(VersionsSidebarContainer);
