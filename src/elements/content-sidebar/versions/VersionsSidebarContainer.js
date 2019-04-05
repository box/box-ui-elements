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
import VersionsSidebar from './VersionsSidebar';
import { withAPIContext } from '../../common/api-context';
import { FILE_VERSION_FIELDS_TO_FETCH } from '../../../utils/fields';

type Props = {
    api: API,
    fileId: string,
    history: RouterHistory,
    match: Match,
    onVersionChange: (versionId?: string) => void,
    parentName: string,
    versionId?: string,
};

type State = {
    error?: string,
    isLoading: boolean,
    permissions: BoxItemPermission,
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
        permissions: {},
        versions: [],
    };

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate({ versionId: prevVersionId }: Props) {
        const { onVersionChange, versionId } = this.props;

        // Forward the current version id that is passed in via the wrapping route
        if (prevVersionId !== versionId) {
            onVersionChange(versionId);
        }
    }

    componentWillUnmount() {
        // Reset the current version id since the wrapping route is no longer active
        this.props.onVersionChange();
    }

    handleActionDelete = (versionId: string): void => {
        this.setState({ isLoading: true }, () => {
            this.deleteVersion(versionId)
                .then(this.fetchData)
                .then(() => this.handleDeleteSuccess(versionId))
                .catch(this.handleActionError);
        });
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

    handleDeleteSuccess = (versionId: string) => {
        const { versionId: selectedVersionId } = this.props;

        // Bump the user to the current version if they deleted their selected version
        if (versionId === selectedVersionId) {
            const { versions } = this.state;
            const { id: currentVersionId } = versions[0] || {};
            this.updateVersion(currentVersionId);
        }
    };

    handleFetchError = ({ message }: ElementsXhrError): void => {
        this.setState({
            error: message,
            isLoading: false,
            permissions: {},
            versions: [],
        });
    };

    handleFetchSuccess = ([file, versions]): [BoxItem, FileVersions] => {
        const { api } = this.props;
        const { entries } = api.getVersionsAPI(false).addCurrentVersion(versions, file) || {};

        this.setState({
            error: undefined,
            isLoading: false,
            permissions: file.permissions || {},
            versions: entries.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
        });

        return [file, versions];
    };

    handlePromoteSuccess = ([file]: [BoxItem, FileVersions]): void => {
        const { file_version: fileVersion } = file;

        if (fileVersion) {
            this.updateVersion(fileVersion.id);
        }
    };

    fetchData = (): Promise<any> => {
        return Promise.all([this.fetchFile(), this.fetchVersions()])
            .then(this.handleFetchSuccess)
            .catch(this.handleFetchError);
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

    deleteVersion = (versionId: string): Promise<null> => {
        const { api, fileId } = this.props;
        const { permissions } = this.state;

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
        const { permissions } = this.state;

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

    updateVersion = (versionId?: string): void => {
        const { history, match } = this.props;
        return history.push(generatePath(match.path, { ...match.params, versionId }));
    };

    updateVersion = (versionId?: string): void => {
        const { history, match } = this.props;
        return history.push(generatePath(match.path, { ...match.params, versionId }));
    };

    render() {
        const { parentName } = this.props;

        return (
            <VersionsSidebar
                onDelete={this.handleActionDelete}
                onPreview={this.handleActionPreview}
                onPromote={this.handleActionPromote}
                parentName={parentName}
                {...this.state}
            />
        );
    }
}

export default flow([withRouter, withAPIContext])(VersionsSidebarContainer);
