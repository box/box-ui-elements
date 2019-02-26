/**
 * @flow
 * @file Versions Sidebar component
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
};

type State = {
    versions: Array<any>,
};

class VersionsSidebarContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        versions: [],
    };

    componentDidMount() {
        const { api, fileId } = this.props;

        api.getVersionsAPI(false).getVersions(fileId, this.handleVersionsSuccess, noop);
    }

    handleVersionsSuccess = versions => {
        this.setState({
            versions: versions.entries,
        });
    };

    render() {
        return <VersionsSidebar {...this.state} />;
    }
}

export default withAPIContext(VersionsSidebarContainer);
