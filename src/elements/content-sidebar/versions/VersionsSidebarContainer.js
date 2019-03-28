/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import React from 'react';
import noop from 'lodash/noop';
import API from '../../../api';
import VersionsSidebar from './VersionsSidebar';
import { withAPIContext } from '../../common/api-context';

type Props = {
    api: API,
    fileId: string,
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
    props: Props;

    state: State = {
        isLoading: true,
        permissions: {},
        versions: [],
    };

    static defaultProps = {
        onVersionChange: noop,
        parentName: '',
    };

    componentDidMount() {
        this.fetchFile();
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

    fetchFile = () => {
        const { api, fileId } = this.props;

        api.getFileAPI().getFile(fileId, this.fetchVersions, this.handleFetchError);
    };

    fetchVersions = (file: BoxItem) => {
        const { api, fileId } = this.props;

        api.getVersionsAPI(false).getVersions(
            fileId,
            responseData => this.handleFetchSuccess(responseData, file),
            this.handleFetchError,
        );
    };

    handleFetchError = ({ message }: ElementsXhrError) => {
        this.setState({
            error: message,
            isLoading: false,
            permissions: {},
            versions: [],
        });
    };

    handleFetchSuccess = (responseData: FileVersions, file: BoxItem) => {
        const { api } = this.props;
        const { entries: versions } = api.getVersionsAPI(false).addCurrentVersion(responseData, file) || {};

        this.setState({
            error: undefined,
            isLoading: false,
            permissions: file.permissions || {},
            versions: versions.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
        });
    };

    render() {
        const { parentName } = this.props;
        return <VersionsSidebar parentName={parentName} {...this.state} />;
    }
}

export default withAPIContext(VersionsSidebarContainer);
