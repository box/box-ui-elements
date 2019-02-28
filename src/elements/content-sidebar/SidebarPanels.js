/**
 * @flow
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SidebarRoute from './SidebarRoute';
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

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    currentUser?: User,
    detailsSidebarProps: DetailsSidebarProps,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasDetails: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    isOpen: boolean,
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

const SidebarPanels = ({
    activitySidebarProps,
    currentUser,
    detailsSidebarProps,
    file,
    fileId,
    getPreview,
    getViewer,
    hasActivityFeed,
    hasDetails,
    hasMetadata,
    hasSkills,
    isOpen,
    metadataSidebarProps,
    onVersionHistoryClick,
}: Props) =>
    (hasActivityFeed || hasDetails || hasMetadata || hasSkills) && (
        <Switch>
            <SidebarRoute
                enabled={hasSkills}
                path={`/${SIDEBAR_VIEW_SKILLS}`}
                pathFallback={`/${SIDEBAR_VIEW_ACTIVITY}`}
                render={() =>
                    isOpen && (
                        <LoadableSkillsSidebar
                            key={file.id}
                            file={file}
                            getPreview={getPreview}
                            getViewer={getViewer}
                            startMarkName={MARK_NAME_JS_LOADING_SKILLS}
                        />
                    )
                }
            />
            <SidebarRoute
                enabled={hasActivityFeed}
                path={`/${SIDEBAR_VIEW_ACTIVITY}`}
                pathFallback={`/${SIDEBAR_VIEW_DETAILS}`}
                render={() =>
                    isOpen && (
                        <LoadableActivitySidebar
                            currentUser={currentUser}
                            file={file}
                            onVersionHistoryClick={onVersionHistoryClick}
                            {...activitySidebarProps}
                            startMarkName={MARK_NAME_JS_LOADING_ACTIVITY}
                        />
                    )
                }
            />
            <SidebarRoute
                enabled={hasDetails}
                path={`/${SIDEBAR_VIEW_DETAILS}`}
                pathFallback={`/${SIDEBAR_VIEW_METADATA}`}
                render={() =>
                    isOpen && (
                        <LoadableDetailsSidebar
                            key={fileId}
                            fileId={fileId}
                            onVersionHistoryClick={onVersionHistoryClick}
                            {...detailsSidebarProps}
                            startMarkName={MARK_NAME_JS_LOADING_DETAILS}
                        />
                    )
                }
            />
            <SidebarRoute
                enabled={hasMetadata}
                path={`/${SIDEBAR_VIEW_METADATA}`}
                pathFallback={`/${SIDEBAR_VIEW_SKILLS}`}
                render={() =>
                    isOpen && (
                        <LoadableMetadataSidebar
                            fileId={fileId}
                            {...metadataSidebarProps}
                            startMarkName={MARK_NAME_JS_LOADING_METADATA}
                        />
                    )
                }
            />
            <Route>
                <Redirect to={`/${SIDEBAR_VIEW_SKILLS}`} />
            </Route>
        </Switch>
    );

export default SidebarPanels;
