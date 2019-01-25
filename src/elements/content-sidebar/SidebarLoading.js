/**
 * @flow
 * @file a placeholder component which will be displayed while a code splitted sidebar chunk is being loaded asyncronously
 * @author Box
 */
import * as React from 'react';
import LoadingIndicator from 'components/loading-indicator/LoadingIndicator';
import SidebarContent from './SidebarContent';
import './SidebarLoading.scss';

type Props = {
    title: React.Node,
};

const SidebarLoading = ({ title }: Props) => {
    return (
        <SidebarContent title={title}>
            <LoadingIndicator className="bcs-sidebar-loading" />
        </SidebarContent>
    );
};

export default SidebarLoading;
