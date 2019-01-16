/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import * as React from 'react';
import DetailsSidebar from './DetailsSidebar';
import SkillsSidebar from './SkillsSidebar';
import ActivitySidebar from './ActivitySidebar';
import MetadataSidebar from './MetadataSidebar';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import './Sidebar.scss';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    currentUser?: User,
    detailsSidebarProps: DetailsSidebarProps,
    features?: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    metadataSidebarProps: MetadataSidebarProps,
    onVersionHistoryClick?: Function,
    selectedView?: SidebarView,
};

const Sidebar = ({
    activitySidebarProps,
    currentUser,
    detailsSidebarProps,
    features,
    file,
    fileId,
    getPreview,
    getViewer,
    metadataSidebarProps,
    onVersionHistoryClick,
    selectedView,
}: Props) => (
    <React.Fragment>
        {selectedView === SIDEBAR_VIEW_DETAILS && (
            <DetailsSidebar
                key={fileId}
                fileId={fileId}
                onVersionHistoryClick={onVersionHistoryClick}
                {...detailsSidebarProps}
            />
        )}
        {selectedView === SIDEBAR_VIEW_SKILLS && (
            <SkillsSidebar key={file.id} file={file} getPreview={getPreview} getViewer={getViewer} />
        )}
        {selectedView === SIDEBAR_VIEW_ACTIVITY && (
            <ActivitySidebar
                currentUser={currentUser}
                features={features}
                file={file}
                onVersionHistoryClick={onVersionHistoryClick}
                {...activitySidebarProps}
            />
        )}
        {selectedView === SIDEBAR_VIEW_METADATA && <MetadataSidebar fileId={fileId} {...metadataSidebarProps} />}
    </React.Fragment>
);

export default Sidebar;
