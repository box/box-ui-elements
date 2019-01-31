/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import * as React from 'react';
import SidebarUtils from './SidebarUtils';
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
const BASE_EVENT_NAME = '_JS_LOADING';
const MARK_NAME_JS_LOADING_DETAILS = `${ORIGIN_DETAILS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_ACTIVITY = `${ORIGIN_ACTIVITY_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_SKILLS = `${ORIGIN_SKILLS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA = `${ORIGIN_METADATA_SIDEBAR}${BASE_EVENT_NAME}`;

const LoadableDetailsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DETAILS, MARK_NAME_JS_LOADING_DETAILS);
const LoadableActivitySidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_ACTIVITY,
    MARK_NAME_JS_LOADING_ACTIVITY,
);
const LoadableSkillsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_SKILLS, MARK_NAME_JS_LOADING_SKILLS);
const LoadableMetadataSidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_METADATA,
    MARK_NAME_JS_LOADING_METADATA,
);

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
            <LoadableDetailsSidebar
                key={fileId}
                fileId={fileId}
                onVersionHistoryClick={onVersionHistoryClick}
                {...detailsSidebarProps}
                startMarkName={MARK_NAME_JS_LOADING_DETAILS}
            />
        )}
        {selectedView === SIDEBAR_VIEW_SKILLS && (
            <LoadableSkillsSidebar
                key={file.id}
                file={file}
                getPreview={getPreview}
                getViewer={getViewer}
                startMarkName={MARK_NAME_JS_LOADING_SKILLS}
            />
        )}
        {selectedView === SIDEBAR_VIEW_ACTIVITY && (
            <LoadableActivitySidebar
                currentUser={currentUser}
                file={file}
                onVersionHistoryClick={onVersionHistoryClick}
                {...activitySidebarProps}
                startMarkName={MARK_NAME_JS_LOADING_ACTIVITY}
            />
        )}
        {selectedView === SIDEBAR_VIEW_METADATA && (
            <LoadableMetadataSidebar
                fileId={fileId}
                {...metadataSidebarProps}
                startMarkName={MARK_NAME_JS_LOADING_METADATA}
            />
        )}
    </React.Fragment>
);

export default Sidebar;
