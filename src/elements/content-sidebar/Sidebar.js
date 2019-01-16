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
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_ACTIVITY_SIDEBAR,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import './Sidebar.scss';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    currentUser?: User,
    detailsSidebarProps: DetailsSidebarProps,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    metadataSidebarProps: MetadataSidebarProps,
    onVersionHistoryClick?: Function,
    selectedView?: SidebarView,
};

// TODO: place into code splitting logic
const MARK_NAME_JS_LOADING_DETAILS = `${ORIGIN_DETAILS_SIDEBAR}_JS_LOADING`;
const MARK_NAME_JS_LOADING_ACTIVITY = `${ORIGIN_ACTIVITY_SIDEBAR}_JS_LOADING`;
const MARK_NAME_JS_LOADING_SKILLS = `${ORIGIN_SKILLS_SIDEBAR}_JS_LOADING`;
const MARK_NAME_JS_LOADING_METADATA = `${ORIGIN_METADATA_SIDEBAR}_JS_LOADING`;

window.performance.mark(MARK_NAME_JS_LOADING_DETAILS);
window.performance.mark(MARK_NAME_JS_LOADING_ACTIVITY);
window.performance.mark(MARK_NAME_JS_LOADING_SKILLS);
window.performance.mark(MARK_NAME_JS_LOADING_METADATA);

const Sidebar = ({
    activitySidebarProps,
    currentUser,
    detailsSidebarProps,
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
                startMarkName={MARK_NAME_JS_LOADING_DETAILS}
            />
        )}
        {selectedView === SIDEBAR_VIEW_SKILLS && (
            <SkillsSidebar
                key={file.id}
                file={file}
                getPreview={getPreview}
                getViewer={getViewer}
                startMarkName={MARK_NAME_JS_LOADING_SKILLS}
            />
        )}
        {selectedView === SIDEBAR_VIEW_ACTIVITY && (
            <ActivitySidebar
                currentUser={currentUser}
                file={file}
                onVersionHistoryClick={onVersionHistoryClick}
                {...activitySidebarProps}
                startMarkName={MARK_NAME_JS_LOADING_ACTIVITY}
            />
        )}
        {selectedView === SIDEBAR_VIEW_METADATA && (
            <MetadataSidebar fileId={fileId} {...metadataSidebarProps} startMarkName={MARK_NAME_JS_LOADING_METADATA} />
        )}
    </React.Fragment>
);

export default Sidebar;
