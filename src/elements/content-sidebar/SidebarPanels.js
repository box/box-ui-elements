/**
 * @flow
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import { matchPath, Redirect, Route, Switch, type Location } from 'react-router-dom';
import SidebarUtils from './SidebarUtils';
import withSidebarAnnotations from './withSidebarAnnotations';
import { withAnnotatorContext } from '../common/annotator-context';
import { withAPIContext } from '../common/api-context';
import { withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withRouterAndRef } from '../common/routing';
import {
    ORIGIN_ACTIVITY_SIDEBAR,
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_DOCGEN_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_VERSIONS_SIDEBAR,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_VERSIONS,
    SIDEBAR_VIEW_DOCGEN,
    SIDEBAR_VIEW_METADATA_REDESIGN,
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { DocGenSidebarProps } from './DocGenSidebar/DocGenSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { VersionsSidebarProps } from './versions';
import type { User, BoxItem } from '../../common/types/core';
import type { Errors } from '../common/flowTypes';
import type { FeatureConfig } from '../common/feature-checking';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    currentUser?: User,
    currentUserError?: Errors,
    detailsSidebarProps: DetailsSidebarProps,
    docGenSidebarProps: DocGenSidebarProps,
    elementId: string,
    features: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivity: boolean,
    hasDetails: boolean,
    hasDocGen: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    hasVersions: boolean,
    isOpen: boolean,
    location: Location,
    metadataSidebarProps: MetadataSidebarProps,
    onAnnotationSelect?: Function,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    versionsSidebarProps: VersionsSidebarProps,
};

type State = {
    isInitialized: boolean,
};

type ElementRefType = {
    current: null | Object,
};

// TODO: place into code splitting logic
const BASE_EVENT_NAME = '_JS_LOADING';
const MARK_NAME_JS_LOADING_DETAILS = `${ORIGIN_DETAILS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_ACTIVITY = `${ORIGIN_ACTIVITY_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_SKILLS = `${ORIGIN_SKILLS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA = `${ORIGIN_METADATA_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA_REDESIGNED = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_DOCGEN = `${ORIGIN_DOCGEN_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_VERSIONS = `${ORIGIN_VERSIONS_SIDEBAR}${BASE_EVENT_NAME}`;

const URL_TO_FEED_ITEM_TYPE = { annotations: 'annotation', comments: 'comment', tasks: 'task' };

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
const LoadableMetadataSidebarRedesigned = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_METADATA_REDESIGN,
    MARK_NAME_JS_LOADING_METADATA,
);
const LoadableDocGenSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DOCGEN, MARK_NAME_JS_LOADING_DOCGEN);
const LoadableVersionsSidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_VERSIONS,
    MARK_NAME_JS_LOADING_VERSIONS,
);

const SIDEBAR_PATH_VERSIONS = '/:sidebar(activity|details)/versions/:versionId?';

class SidebarPanels extends React.Component<Props, State> {
    activitySidebar: ElementRefType = React.createRef();

    detailsSidebar: ElementRefType = React.createRef();

    metadataSidebar: ElementRefType = React.createRef();

    state: State = { isInitialized: false };

    versionsSidebar: ElementRefType = React.createRef();

    componentDidMount() {
        this.setState({ isInitialized: true });
    }

    componentDidUpdate(prevProps: Props): void {
        const { location, onVersionChange } = this.props;
        const { location: prevLocation } = prevProps;

        // Reset the current version id if the wrapping versions route is no longer active
        if (onVersionChange && this.getVersionsMatchPath(prevLocation) && !this.getVersionsMatchPath(location)) {
            onVersionChange(null);
        }
    }

    getVersionsMatchPath = (location: Location) => {
        const { pathname } = location;
        return matchPath(pathname, SIDEBAR_PATH_VERSIONS);
    };

    /**
     * Refreshes the contents of the active sidebar
     * @returns {void}
     */
    refresh(shouldRefreshCache: boolean = true): void {
        const { current: activitySidebar } = this.activitySidebar;
        const { current: detailsSidebar } = this.detailsSidebar;
        const { current: metadataSidebar } = this.metadataSidebar;
        const { current: versionsSidebar } = this.versionsSidebar;

        if (activitySidebar) {
            activitySidebar.refresh(shouldRefreshCache);
        }

        if (detailsSidebar) {
            detailsSidebar.refresh();
        }

        if (metadataSidebar) {
            metadataSidebar.refresh();
        }

        if (versionsSidebar) {
            versionsSidebar.refresh();
        }
    }

    render() {
        const {
            activitySidebarProps,
            currentUser,
            currentUserError,
            detailsSidebarProps,
            docGenSidebarProps,
            elementId,
            features,
            file,
            fileId,
            getPreview,
            getViewer,
            hasActivity,
            hasDetails,
            hasDocGen,
            hasMetadata,
            hasSkills,
            hasVersions,
            isOpen,
            metadataSidebarProps,
            onAnnotationSelect,
            onVersionChange,
            onVersionHistoryClick,
            versionsSidebarProps,
        }: Props = this.props;

        const { isInitialized } = this.state;

        const isMetadataSidebarRedesignEnabled = isFeatureEnabled(features, 'metadata.redesign.enabled');

        if (!isOpen || (!hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions)) {
            return null;
        }

        return (
            <Switch>
                {hasSkills && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_SKILLS}`}
                        render={() => (
                            <LoadableSkillsSidebar
                                elementId={elementId}
                                key={file.id}
                                file={file}
                                getPreview={getPreview}
                                getViewer={getViewer}
                                hasSidebarInitialized={isInitialized}
                                startMarkName={MARK_NAME_JS_LOADING_SKILLS}
                            />
                        )}
                    />
                )}
                {/* This handles both the default activity sidebar and the activity sidebar with a
                comment or task deeplink.  */}
                {hasActivity && (
                    <Route
                        exact
                        path={[
                            `/${SIDEBAR_VIEW_ACTIVITY}`,
                            `/${SIDEBAR_VIEW_ACTIVITY}/:activeFeedEntryType(annotations)/:fileVersionId/:activeFeedEntryId?`,
                            `/${SIDEBAR_VIEW_ACTIVITY}/:activeFeedEntryType(comments|tasks)/:activeFeedEntryId?`,
                        ]}
                        render={({ match }) => {
                            const matchEntryType = match.params.activeFeedEntryType;
                            const activeFeedEntryType = matchEntryType
                                ? URL_TO_FEED_ITEM_TYPE[matchEntryType]
                                : undefined;
                            return (
                                <LoadableActivitySidebar
                                    elementId={elementId}
                                    currentUser={currentUser}
                                    currentUserError={currentUserError}
                                    file={file}
                                    hasSidebarInitialized={isInitialized}
                                    onAnnotationSelect={onAnnotationSelect}
                                    onVersionChange={onVersionChange}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    ref={this.activitySidebar}
                                    startMarkName={MARK_NAME_JS_LOADING_ACTIVITY}
                                    activeFeedEntryId={match.params.activeFeedEntryId}
                                    activeFeedEntryType={match.params.activeFeedEntryId && activeFeedEntryType}
                                    {...activitySidebarProps}
                                />
                            );
                        }}
                    />
                )}
                {hasDetails && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_DETAILS}`}
                        render={() => (
                            <LoadableDetailsSidebar
                                elementId={elementId}
                                fileId={fileId}
                                hasSidebarInitialized={isInitialized}
                                key={fileId}
                                hasVersions={hasVersions}
                                onVersionHistoryClick={onVersionHistoryClick}
                                ref={this.detailsSidebar}
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
                        render={() =>
                            isMetadataSidebarRedesignEnabled ? (
                                <LoadableMetadataSidebarRedesigned
                                    elementId={elementId}
                                    fileId={fileId}
                                    hasSidebarInitialized={isInitialized}
                                    ref={this.metadataSidebar}
                                    startMarkName={MARK_NAME_JS_LOADING_METADATA_REDESIGNED}
                                    {...metadataSidebarProps}
                                />
                            ) : (
                                <LoadableMetadataSidebar
                                    elementId={elementId}
                                    fileId={fileId}
                                    hasSidebarInitialized={isInitialized}
                                    ref={this.metadataSidebar}
                                    startMarkName={MARK_NAME_JS_LOADING_METADATA}
                                    {...metadataSidebarProps}
                                />
                            )
                        }
                    />
                )}
                {hasDocGen && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_DOCGEN}`}
                        render={() => (
                            <LoadableDocGenSidebar
                                hasSidebarInitialized={isInitialized}
                                startMarkName={MARK_NAME_JS_LOADING_DOCGEN}
                                {...docGenSidebarProps}
                            />
                        )}
                    />
                )}
                {hasVersions && (
                    <Route
                        path={SIDEBAR_PATH_VERSIONS}
                        render={({ match }) => (
                            <LoadableVersionsSidebar
                                fileId={fileId}
                                hasSidebarInitialized={isInitialized}
                                key={fileId}
                                onVersionChange={onVersionChange}
                                parentName={match.params.sidebar}
                                ref={this.versionsSidebar}
                                versionId={match.params.versionId}
                                {...versionsSidebarProps}
                            />
                        )}
                    />
                )}
                <Route
                    render={() => {
                        let redirect = '';

                        if (hasDocGen) {
                            redirect = SIDEBAR_VIEW_DOCGEN;
                        } else if (hasSkills) {
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
}

export { SidebarPanels as SidebarPanelsComponent };
export default flow([
    withFeatureConsumer,
    withSidebarAnnotations,
    withAPIContext,
    withAnnotatorContext,
    withRouterAndRef,
])(SidebarPanels);
