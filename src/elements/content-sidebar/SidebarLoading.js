/**
 * @flow
 * @file a placeholder component which will be displayed while a code splitted sidebar chunk is being loaded asyncronously
 * @author Box
 */
import * as React from 'react';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import SidebarContent from './SidebarContent';
import SidebarSection from './SidebarSection';
import './SidebarLoading.scss';

type Props = {
    title: React.Node,
};

const SidebarLoading = ({ title }: Props) => {
    return (
        <SidebarContent title={title}>
            <SidebarSection isOpen>
                <LoadingIndicator className="bcs-sidebar-loading" />
            </SidebarSection>
        </SidebarContent>
    );
};

export default SidebarLoading;
