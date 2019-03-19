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
    versions: Array<BoxItemVersion>,
};

class VersionsSidebarContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        isLoading: true,
        versions: [],
    };

    static defaultProps = {
        onVersionChange: noop,
        parentName: '',
    };

    componentDidMount() {
        const { api, fileId } = this.props;

        api.getVersionsAPI(false).getVersions(fileId, this.handleFetchVersionsSuccess, this.handleFetchVersionsError);
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

    handleFetchVersionsError = ({ message }) => {
        this.setState({
            error: message,
            isLoading: false,
            versions: [],
        });
    };

    handleFetchVersionsSuccess = ({ entries: versions }) => {
        this.setState({
            error: undefined,
            isLoading: false,
            versions,
        });
    };

    render() {
        const { parentName } = this.props;
        return <VersionsSidebar parentName={parentName} {...this.state} />;
    }
}

export default withAPIContext(VersionsSidebarContainer);
