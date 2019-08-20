/**
 * @flow
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SidebarUtils from './SidebarUtils';
import {
    ORIGIN_ACTIVITY_SIDEBAR,
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_VERSIONS_SIDEBAR,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_VERSIONS,
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { VersionsSidebarProps } from './versions';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    currentUser?: User,
    detailsSidebarProps: DetailsSidebarProps,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivity: boolean,
    hasDetails: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    hasVersions: boolean,
    isOpen: boolean,
    metadataSidebarProps: MetadataSidebarProps,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    versionsSidebarProps: VersionsSidebarProps,
};

// TODO: place into code splitting logic
const BASE_EVENT_NAME = '_JS_LOADING';
const MARK_NAME_JS_LOADING_DETAILS = `${ORIGIN_DETAILS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_ACTIVITY = `${ORIGIN_ACTIVITY_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_SKILLS = `${ORIGIN_SKILLS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA = `${ORIGIN_METADATA_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_VERSIONS = `${ORIGIN_VERSIONS_SIDEBAR}${BASE_EVENT_NAME}`;

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
const LoadableVersionsSidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_VERSIONS,
    MARK_NAME_JS_LOADING_VERSIONS,
);

class SidebarPanels extends React.Component<Props, State> {
    activitySidebarRef: React.Ref<any> = React.createRef();

    detailsSidebarRef: React.Ref<any> = React.createRef();

    metadataSidebarRef: React.Ref<any> = React.createRef();

    versionsSidebarRef: React.Ref<any> = React.createRef();

    /**
     * Refreshes the contents of the active sidebar
     * @returns {void}
     */
    refresh(): void {
        if (this.activitySidebarRef && this.activitySidebarRef.current) {
            this.activitySidebarRef.current.refresh();
        }

        if (this.detailsSidebarRef && this.detailsSidebarRef.current) {
            this.detailsSidebarRef.current.refresh();
        }

        if (this.metadataSidebarRef && this.metadataSidebarRef.current) {
            this.metadataSidebarRef.current.refresh();
        }

        if (this.versionsSidebarRef && this.versionsSidebarRef.current) {
            this.versionsSidebarRef.current.refresh();
        }
    }

    render() {
        const {
            activitySidebarProps,
            currentUser,
            detailsSidebarProps,
            file,
            fileId,
            getPreview,
            getViewer,
            hasActivity,
            hasDetails,
            hasMetadata,
            hasSkills,
            hasVersions,
            isOpen,
            metadataSidebarProps,
            onVersionChange,
            onVersionHistoryClick,
            versionsSidebarProps,
        }: Props = this.props;

        if (isOpen) {
            return (
                <Switch>
                    {hasSkills && (
                        <Route
                            exact
                            path={`/${SIDEBAR_VIEW_SKILLS}`}
                            render={() => (
                                <LoadableSkillsSidebar
                                    key={file.id}
                                    file={file}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    startMarkName={MARK_NAME_JS_LOADING_SKILLS}
                                />
                            )}
                        />
                    )}
                    {hasActivity && (
                        <Route
                            exact
                            path={`/${SIDEBAR_VIEW_ACTIVITY}`}
                            render={() => (
                                <LoadableActivitySidebar
                                    currentUser={currentUser}
                                    file={file}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    ref={this.activitySidebarRef}
                                    startMarkName={MARK_NAME_JS_LOADING_ACTIVITY}
                                    {...activitySidebarProps}
                                />
                            )}
                        />
                    )}
                    {hasDetails && (
                        <Route
                            exact
                            path={`/${SIDEBAR_VIEW_DETAILS}`}
                            render={() => (
                                <LoadableDetailsSidebar
                                    fileId={fileId}
                                    key={fileId}
                                    hasVersions={hasVersions}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    ref={this.detailsSidebarRef}
                                    startMarkName={MARK_NAME_JS_LOADING_DETAILS}
                                    {...detailsSidebarProps}
                                />
                            )}
                        />
                    )}
                    {hasMetadata && (
                        <Route
                            exact
                            path={`/${SIDEBAR_VIEW_METADATA}`}
                            render={() => (
                                <LoadableMetadataSidebar
                                    fileId={fileId}
                                    ref={this.metadataSidebarRef}
                                    startMarkName={MARK_NAME_JS_LOADING_METADATA}
                                    {...metadataSidebarProps}
                                />
                            )}
                        />
                    )}
                    {hasVersions && (
                        <Route
                            path="/:sidebar/versions/:versionId?"
                            render={({ match }) => (
                                <LoadableVersionsSidebar
                                    fileId={fileId}
                                    key={fileId}
                                    onVersionChange={onVersionChange}
                                    parentName={match.params.sidebar}
                                    ref={this.versionsSidebarRef}
                                    versionId={match.params.versionId}
                                    {...versionsSidebarProps}
                                />
                            )}
                        />
                    )}
                    <Route
                        render={() => {
                            let redirect = '';

                            if (hasSkills) {
                                redirect = SIDEBAR_VIEW_SKILLS;
                            } else if (hasActivity) {
                                redirect = SIDEBAR_VIEW_ACTIVITY;
                            } else if (hasDetails) {
                                redirect = SIDEBAR_VIEW_DETAILS;
                            } else if (hasMetadata) {
                                redirect = SIDEBAR_VIEW_METADATA;
                            }

                            return <Redirect to={{ pathname: `/${redirect}`, state: { silent: true } }} />;
                        }}
                    />
                </Switch>
            );
        }

        return null;
    }
}

export default SidebarPanels;
