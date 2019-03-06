/**
 * @flow
 * @file Versions Sidebar container
 * @author Box
 */

import React from 'react';
import API from '../../../api';
import VersionsSidebar from './VersionsSidebar';
import { withAPIContext } from '../../common/api-context';

type Props = {
    api: API,
    fileId: string,
};

type State = {
    error?: string,
    versions: Array<any>,
};

class VersionsSidebarContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        versions: [],
    };

    componentDidMount() {
        const { api, fileId } = this.props;

        api.getVersionsAPI(false).getVersions(fileId, this.handleFetchVersionsSuccess, this.handleFetchVersionsError);
    }

    handleFetchVersionsError = ({ message }) => {
        this.setState({ error: message, versions: [] });
    };

    handleFetchVersionsSuccess = ({ entries: versions }) => {
        this.setState({ error: undefined, versions });
    };

    render() {
        return <VersionsSidebar {...this.state} />;
    }
}

export default withAPIContext(VersionsSidebarContainer);
