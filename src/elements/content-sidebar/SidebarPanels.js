/* eslint-disable max-classes-per-file */
/**
 * @flow
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import { matchPath, Redirect, Route, Switch, type Location } from 'react-router-dom';
import SidebarUtils from './SidebarUtils';
import withSidebarAnnotations from './withSidebarAnnotations';
import { withAnnotatorContext } from '../common/annotator-context';
import { withAPIContext } from '../common/api-context';
import { getFeatureConfig, withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
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
    SIDEBAR_VIEW_BOXAI,
    ORIGIN_BOXAI_SIDEBAR,
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { DocGenSidebarProps } from './DocGenSidebar/DocGenSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { BoxAISidebarProps } from './BoxAISidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { VersionsSidebarProps } from './versions';
import type { User, BoxItem } from '../../common/types/core';
import type { Errors } from '../common/flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import type { BoxAISidebarCache } from './types/BoxAISidebarTypes';
import type {
    InternalSidebarNavigation,
    InternalSidebarNavigationHandler,
} from '../common/types/SidebarNavigation';
import { FeedEntryType,ViewType } from '../common/types/SidebarNavigation';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    boxAISidebarProps: BoxAISidebarProps,
    currentUser?: User,
    currentUserError?: Errors,
    defaultPanel?: string,
    detailsSidebarProps: DetailsSidebarProps,
    docGenSidebarProps: DocGenSidebarProps,
    elementId: string,
    features: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivity: boolean,
    hasBoxAI: boolean,
    hasDetails: boolean,
    hasDocGen: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    hasVersions: boolean,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isOpen: boolean,
    location: Location,
    metadataSidebarProps: MetadataSidebarProps,
    onAnnotationSelect?: Function,
    onPanelChange?: (name: string, isInitialState?: boolean) => void,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    routerDisabled?: boolean,
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
const MARK_NAME_JS_LOADING_BOXAI = `${ORIGIN_BOXAI_SIDEBAR}${BASE_EVENT_NAME}`;
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
const LoadableBoxAISidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_BOXAI, MARK_NAME_JS_LOADING_BOXAI);
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

class SidebarPanelsRouter extends React.Component<Props, State> {
    boxAISidebar: ElementRefType = React.createRef();

    activitySidebar: ElementRefType = React.createRef();

    detailsSidebar: ElementRefType = React.createRef();

    initialPanel: { current: null | string } = React.createRef();

    metadataSidebar: ElementRefType = React.createRef();

    state: State = { isInitialized: false };

    versionsSidebar: ElementRefType = React.createRef();

    boxAiSidebarCache: BoxAISidebarCache = {
        agents: {
            agents: [],
            selectedAgent: null,
            requestState: 'not_started',
        },
        encodedSession: null,
        questions: [],
        shouldShowLandingPage: true,
        suggestedQuestions: [],
    };

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

    handlePanelRender = (panel: string): void => {
        const { onPanelChange = noop } = this.props;
        // Call onPanelChange only once with the initial panel
        if (!this.initialPanel.current) {
            this.initialPanel.current = panel;
            onPanelChange(panel, true);
        }
    };

    setBoxAiSidebarCacheValue = (key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestedQuestions', value: any) => {
        this.boxAiSidebarCache[key] = value;
    };

    /**
     * Refreshes the contents of the active sidebar
     * @returns {void}
     */
    refresh(shouldRefreshCache: boolean = true): void {
        const { current: boxAISidebar } = this.boxAISidebar;
        const { current: activitySidebar } = this.activitySidebar;
        const { current: detailsSidebar } = this.detailsSidebar;
        const { current: metadataSidebar } = this.metadataSidebar;
        const { current: versionsSidebar } = this.versionsSidebar;

        if (boxAISidebar) {
            boxAISidebar.refresh();
        }

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
            boxAISidebarProps,
            currentUser,
            currentUserError,
            defaultPanel = '',
            detailsSidebarProps,
            docGenSidebarProps,
            elementId,
            features,
            file,
            fileId,
            getPreview,
            getViewer,
            hasActivity,
            hasBoxAI,
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
        const isMetadataAiSuggestionsEnabled = isFeatureEnabled(features, 'metadata.aiSuggestions.enabled');
        const { shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel, showOnlyNavButton: showOnlyBoxAINavButton } =
            getFeatureConfig(features, 'boxai.sidebar');

        const canShowBoxAISidebarPanel = hasBoxAI && !showOnlyBoxAINavButton;

        const panelsEligibility = {
            [SIDEBAR_VIEW_BOXAI]: canShowBoxAISidebarPanel,
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
        };

        const showDefaultPanel: boolean = !!(defaultPanel && panelsEligibility[defaultPanel]);

        if (!isOpen || (!hasBoxAI && !hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions)) {
            return null;
        }

        return (
            <Switch>
                {canShowBoxAISidebarPanel && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_BOXAI}`}
                        render={() => {
                            this.handlePanelRender(SIDEBAR_VIEW_BOXAI);
                            return (
                                <LoadableBoxAISidebar
                                    contentName={file.name}
                                    elementId={elementId}
                                    fileExtension={file.extension}
                                    fileID={file.id}
                                    hasSidebarInitialized={isInitialized}
                                    ref={this.boxAISidebar}
                                    startMarkName={MARK_NAME_JS_LOADING_BOXAI}
                                    cache={this.boxAiSidebarCache}
                                    setCacheValue={this.setBoxAiSidebarCacheValue}
                                    {...boxAISidebarProps}
                                />
                            );
                        }}
                    />
                )}
                {hasSkills && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_SKILLS}`}
                        render={() => {
                            this.handlePanelRender(SIDEBAR_VIEW_SKILLS);
                            return (
                                <LoadableSkillsSidebar
                                    elementId={elementId}
                                    key={file.id}
                                    file={file}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    hasSidebarInitialized={isInitialized}
                                    startMarkName={MARK_NAME_JS_LOADING_SKILLS}
                                />
                            );
                        }}
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
                            this.handlePanelRender(SIDEBAR_VIEW_ACTIVITY);
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
                        render={() => {
                            this.handlePanelRender(SIDEBAR_VIEW_DETAILS);
                            return (
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
                            );
                        }}
                    />
                )}
                {hasMetadata && (
                    <Route
                        exact
                        path={[
                            `/${SIDEBAR_VIEW_METADATA}`,
                            `/${SIDEBAR_VIEW_METADATA}/filteredTemplates/:filteredTemplateIds?`,
                        ]}
                        render={({ match }) => {
                            this.handlePanelRender(SIDEBAR_VIEW_METADATA);
                            return isMetadataSidebarRedesignEnabled ? (
                                <LoadableMetadataSidebarRedesigned
                                    elementId={elementId}
                                    fileExtension={file.extension}
                                    fileId={fileId}
                                    filteredTemplateIds={
                                        match.params.filteredTemplateIds
                                            ? match.params.filteredTemplateIds.split(',')
                                            : []
                                    }
                                    hasSidebarInitialized={isInitialized}
                                    isBoxAiSuggestionsEnabled={isMetadataAiSuggestionsEnabled}
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
                            );
                        }}
                    />
                )}
                {hasDocGen && (
                    <Route
                        exact
                        path={`/${SIDEBAR_VIEW_DOCGEN}`}
                        render={() => {
                            this.handlePanelRender(SIDEBAR_VIEW_DOCGEN);
                            return (
                                <LoadableDocGenSidebar
                                    hasSidebarInitialized={isInitialized}
                                    startMarkName={MARK_NAME_JS_LOADING_DOCGEN}
                                    {...docGenSidebarProps}
                                />
                            );
                        }}
                    />
                )}
                {hasVersions && (
                    <Route
                        path={SIDEBAR_PATH_VERSIONS}
                        render={({ match }) => {
                            if (match.params.sidebar) {
                                this.handlePanelRender(match.params.sidebar);
                            }
                            return (
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
                            );
                        }}
                    />
                )}
                <Route
                    render={() => {
                        let redirect = '';

                        if (showDefaultPanel) {
                            redirect = defaultPanel;
                        } else if (canShowBoxAISidebarPanel && shouldBoxAIBeDefaultPanel) {
                            redirect = SIDEBAR_VIEW_BOXAI;
                        } else if (hasDocGen) {
                            redirect = SIDEBAR_VIEW_DOCGEN;
                        } else if (hasSkills) {
                            redirect = SIDEBAR_VIEW_SKILLS;
                        } else if (hasActivity) {
                            redirect = SIDEBAR_VIEW_ACTIVITY;
                        } else if (hasDetails) {
                            redirect = SIDEBAR_VIEW_DETAILS;
                        } else if (hasMetadata) {
                            redirect = SIDEBAR_VIEW_METADATA;
                        } else if (canShowBoxAISidebarPanel && !shouldBoxAIBeDefaultPanel) {
                            redirect = SIDEBAR_VIEW_BOXAI;
                        }

                        return <Redirect to={{ pathname: `/${redirect}`, state: { silent: true } }} />;
                    }}
                />
            </Switch>
        );
    }
}

class SidebarPanelsRouterDisabled extends React.Component<Props, State> {
    boxAISidebar: ElementRefType = React.createRef();

    activitySidebar: ElementRefType = React.createRef();

    detailsSidebar: ElementRefType = React.createRef();

    initialPanel: { current: null | string } = React.createRef();

    metadataSidebar: ElementRefType = React.createRef();

    state: State = { isInitialized: false };

    versionsSidebar: ElementRefType = React.createRef();

    boxAiSidebarCache: BoxAISidebarCache = {
        agents: {
            agents: [],
            selectedAgent: null,
            requestState: 'not_started',
        },
        encodedSession: null,
        questions: [],
        shouldShowLandingPage: true,
        suggestedQuestions: [],
    };

    componentDidMount() {
        this.setState({ isInitialized: true });
    }

    componentDidUpdate(prevProps: Props): void {
        const { onVersionChange, internalSidebarNavigation } = this.props;
        const { internalSidebarNavigation: prevInternalSidebarNavigation } = prevProps;

        // Reset the current version id if the wrapping versions route is no longer active
        if (onVersionChange) {
            const wasOnVersionsPath = this.isVersionsNavigationPath(prevInternalSidebarNavigation);
            const isOnVersionsPath = this.isVersionsNavigationPath(internalSidebarNavigation);

            if (wasOnVersionsPath && !isOnVersionsPath) {
                onVersionChange(null);
            }
        }
    }

    isVersionsNavigationPath = (navigation: InternalSidebarNavigation) => {
        if (!navigation) {
            return false;
        }
        const { sidebar, activeFeedEntryType } = navigation;
        return (sidebar === ViewType.ACTIVITY || sidebar === ViewType.DETAILS) && 
               (activeFeedEntryType === FeedEntryType.VERSIONS);
    };

    handlePanelRender = (panel: string): void => {
        const { onPanelChange = noop } = this.props;
        // Call onPanelChange only once with the initial panel
        if (!this.initialPanel.current) {
            this.initialPanel.current = panel;
            onPanelChange(panel, true);
        }
    };

    setBoxAiSidebarCacheValue = (key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestedQuestions', value: any) => {
        this.boxAiSidebarCache[key] = value;
    };

    findSidebarToRender = (): string | null => {
        const {
            defaultPanel,
            features,
            hasActivity,
            hasBoxAI,
            hasDetails,
            hasDocGen,
            hasMetadata,
            hasSkills,
            hasVersions,
            internalSidebarNavigation,
            isOpen,
        } = this.props;


        const { shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel, showOnlyNavButton: showOnlyBoxAINavButton } =
            getFeatureConfig(features, 'boxai.sidebar');

        const canShowBoxAISidebarPanel = hasBoxAI && !showOnlyBoxAINavButton;

        const panelsEligibility = {
            [SIDEBAR_VIEW_BOXAI]: canShowBoxAISidebarPanel,
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
        };

        const showDefaultPanel: boolean = !!(defaultPanel && panelsEligibility[defaultPanel]);

        if (!isOpen || (!hasBoxAI && !hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions)) {
            return null;
        }

        const currentSidebar = internalSidebarNavigation?.sidebar;
        const versionId = internalSidebarNavigation?.versionId;
        const activeFeedEntryType = internalSidebarNavigation?.activeFeedEntryType;

        if (currentSidebar === SIDEBAR_VIEW_BOXAI && canShowBoxAISidebarPanel) {
            return SIDEBAR_VIEW_BOXAI;
        }

        if (currentSidebar === SIDEBAR_VIEW_SKILLS && hasSkills) {
            return SIDEBAR_VIEW_SKILLS;
        }

        if (currentSidebar === SIDEBAR_VIEW_ACTIVITY && hasActivity) {
            if (activeFeedEntryType === undefined || 
                activeFeedEntryType === FeedEntryType.COMMENTS ||
                activeFeedEntryType === FeedEntryType.TASKS ||
                (activeFeedEntryType === FeedEntryType.ANNOTATIONS && internalSidebarNavigation?.fileVersionId)
            ) {
                return SIDEBAR_VIEW_ACTIVITY;
            }
        }

        if (currentSidebar === SIDEBAR_VIEW_DETAILS && 
            hasDetails && 
            activeFeedEntryType !== FeedEntryType.VERSIONS && 
            versionId === undefined) 
        {
            return SIDEBAR_VIEW_DETAILS;
        }

        if (currentSidebar === SIDEBAR_VIEW_METADATA && hasMetadata) {
            return SIDEBAR_VIEW_METADATA;
        }

        if (currentSidebar === SIDEBAR_VIEW_DOCGEN && hasDocGen) {
            return SIDEBAR_VIEW_DOCGEN;
        }

        if (hasVersions && 
            (currentSidebar === SIDEBAR_VIEW_ACTIVITY || currentSidebar === SIDEBAR_VIEW_DETAILS) && 
            activeFeedEntryType === FeedEntryType.VERSIONS) 
        {
            return SIDEBAR_VIEW_VERSIONS
        }

        // Determine default sidebar using the same logic as the router version
        if (showDefaultPanel) {
            return defaultPanel;
        } if (canShowBoxAISidebarPanel && shouldBoxAIBeDefaultPanel) {
            return SIDEBAR_VIEW_BOXAI;
        } if (hasDocGen) {
            return SIDEBAR_VIEW_DOCGEN;
        } if (hasSkills) {
            return SIDEBAR_VIEW_SKILLS;
        } if (hasActivity) {
            return SIDEBAR_VIEW_ACTIVITY;
        } if (hasDetails) {
            return SIDEBAR_VIEW_DETAILS;
        } if (hasMetadata) {
            return SIDEBAR_VIEW_METADATA;
        } if (canShowBoxAISidebarPanel && !shouldBoxAIBeDefaultPanel) {
            return SIDEBAR_VIEW_BOXAI;
        }

        return null;
    }

    /**
     * Refreshes the contents of the active sidebar
     * @returns {void}
     */
    refresh(shouldRefreshCache: boolean = true): void {
        const { current: boxAISidebar } = this.boxAISidebar;
        const { current: activitySidebar } = this.activitySidebar;
        const { current: detailsSidebar } = this.detailsSidebar;
        const { current: metadataSidebar } = this.metadataSidebar;
        const { current: versionsSidebar } = this.versionsSidebar;

        if (boxAISidebar) {
            boxAISidebar.refresh();
        }

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
            boxAISidebarProps,
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
            hasBoxAI,
            hasDetails,
            hasMetadata,
            hasSkills,
            hasVersions,
            internalSidebarNavigation,
            internalSidebarNavigationHandler,
            isOpen,
            metadataSidebarProps,
            onAnnotationSelect,
            onVersionChange,
            onVersionHistoryClick,
            versionsSidebarProps,
        } = this.props;

        const { isInitialized } = this.state;

        if (!isOpen || (!hasBoxAI && !hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions)) {
            return null;
        }

        const sidebarToRender = this.findSidebarToRender();

        if (sidebarToRender) {
            if (sidebarToRender === SIDEBAR_VIEW_VERSIONS) {
                this.handlePanelRender(internalSidebarNavigation?.sidebar);
            } else {
                this.handlePanelRender(sidebarToRender);
            }
        }

        // Render the appropriate sidebar based on currentSidebar
        if (sidebarToRender === SIDEBAR_VIEW_BOXAI) {
            return (
                <LoadableBoxAISidebar
                    contentName={file.name}
                    elementId={elementId}
                    fileExtension={file.extension}
                    fileID={file.id}
                    hasSidebarInitialized={isInitialized}
                    ref={this.boxAISidebar}
                    startMarkName={MARK_NAME_JS_LOADING_BOXAI}
                    cache={this.boxAiSidebarCache}
                    setCacheValue={this.setBoxAiSidebarCacheValue}
                    {...boxAISidebarProps}
                />
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_SKILLS) {
            return (
                <LoadableSkillsSidebar
                    elementId={elementId}
                    key={file.id}
                    file={file}
                    getPreview={getPreview}
                    getViewer={getViewer}
                    hasSidebarInitialized={isInitialized}
                    startMarkName={MARK_NAME_JS_LOADING_SKILLS}
                />
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_ACTIVITY) {
            // Extract activity-specific params from internal navigation
            const activeFeedEntryId = internalSidebarNavigation?.activeFeedEntryId;
            const rawActiveFeedEntryType = internalSidebarNavigation?.activeFeedEntryType;
            // Convert activeFeedEntryType to match what ActivitySidebar expects (same as router version)
            const activeFeedEntryType = rawActiveFeedEntryType
                ? URL_TO_FEED_ITEM_TYPE[rawActiveFeedEntryType] || rawActiveFeedEntryType
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
                    activeFeedEntryId={activeFeedEntryId}
                    activeFeedEntryType={activeFeedEntryId && activeFeedEntryType}
                    routerDisabled={true}
                    internalSidebarNavigation={internalSidebarNavigation}
                    internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                    {...activitySidebarProps}
                />
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_DETAILS) {
            return (
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
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_METADATA) {
            // Extract metadata-specific params from internal navigation
            const filteredTemplateIds = internalSidebarNavigation?.filteredTemplateIds || [];
            const isMetadataSidebarRedesignEnabled = isFeatureEnabled(features, 'metadata.redesign.enabled');
            const isMetadataAiSuggestionsEnabled = isFeatureEnabled(features, 'metadata.aiSuggestions.enabled');


            return isMetadataSidebarRedesignEnabled ? (
                <LoadableMetadataSidebarRedesigned
                    elementId={elementId}
                    fileExtension={file.extension}
                    fileId={fileId}
                    filteredTemplateIds={filteredTemplateIds}
                    hasSidebarInitialized={isInitialized}
                    isBoxAiSuggestionsEnabled={isMetadataAiSuggestionsEnabled}
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
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_DOCGEN) {
            return (
                <LoadableDocGenSidebar
                    hasSidebarInitialized={isInitialized}
                    startMarkName={MARK_NAME_JS_LOADING_DOCGEN}
                    {...docGenSidebarProps}
                />
            );
        }

        if (sidebarToRender === SIDEBAR_VIEW_VERSIONS) {
            const versionId = internalSidebarNavigation?.versionId;
            const parentName = internalSidebarNavigation?.sidebar; // Should be 'activity' or 'details'
            return (
                <LoadableVersionsSidebar
                    fileId={fileId}
                    hasSidebarInitialized={isInitialized}
                    key={fileId}
                    onVersionChange={onVersionChange}
                    parentName={parentName}
                    ref={this.versionsSidebar}
                    versionId={versionId}
                    routerDisabled={true}
                    internalSidebarNavigation={internalSidebarNavigation}
                    internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                    {...versionsSidebarProps}
                />
            );
        }

        return null;
    }
}

class SidebarPanels extends React.Component<Props> {
    render() {
        const { routerDisabled, ...otherProps } = this.props;
        
        if (routerDisabled) {
            return <SidebarPanelsRouterDisabled {...otherProps} />;
        }
        
        return <SidebarPanelsRouter {...otherProps} />;
    }
}

export { SidebarPanelsRouter as SidebarPanelsComponent };
export { SidebarPanelsRouterDisabled as SidebarPanelsRouterDisabledComponent };
export default flow([
    withFeatureConsumer,
    withSidebarAnnotations,
    withAPIContext,
    withAnnotatorContext,
    withRouterAndRef,
])(SidebarPanels);
