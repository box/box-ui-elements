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
    ORIGIN_BOXAI_SIDEBAR,
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_DOCGEN_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR_REDESIGN,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_VERSIONS_SIDEBAR,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_BOXAI,
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
import type { BoxAISidebarProps } from './BoxAISidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { VersionsSidebarProps } from './versions';
import type { User, BoxItem } from '../../common/types/core';
import type { Errors } from '../common/flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import type { BoxAISidebarCache } from './types/BoxAISidebarTypes';
import type { CustomSidebarPanel } from './flowTypes';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';
import { FeedEntryType, ViewType } from '../common/types/SidebarNavigation';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    boxAISidebarProps: BoxAISidebarProps,
    customSidebarPanels: Array<CustomSidebarPanel>,
    currentUser?: User,
    currentUserError?: Errors,
    defaultPanel?: string,
    detailsSidebarProps: DetailsSidebarProps,
    docGenSidebarProps: DocGenSidebarProps,
    elementId: string,
    features: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getComparedPreview?: Function,
    getPreview: Function,
    getViewer: Function,
    hasActivity: boolean,
    hasNativeBoxAISidebar: boolean,
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
    onCommentVersionSelect?: (params: { fileVersionId: string, startMs: number }) => void,
    onPanelChange?: (name: string, isInitialState?: boolean) => void,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    routerDisabled?: boolean,
    /** When true, enables data fetching. When false, defers data fetching. Used to prioritize preview loading. */
    shouldFetchSidebarData?: boolean,
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
const MARK_NAME_JS_LOADING_ACTIVITY = `${ORIGIN_ACTIVITY_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_BOXAI = `${ORIGIN_BOXAI_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_DETAILS = `${ORIGIN_DETAILS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_DOCGEN = `${ORIGIN_DOCGEN_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA = `${ORIGIN_METADATA_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_METADATA_REDESIGNED = `${ORIGIN_METADATA_SIDEBAR_REDESIGN}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_SKILLS = `${ORIGIN_SKILLS_SIDEBAR}${BASE_EVENT_NAME}`;
const MARK_NAME_JS_LOADING_VERSIONS = `${ORIGIN_VERSIONS_SIDEBAR}${BASE_EVENT_NAME}`;

// `versions` sets undefined value - this situation will never happen, but it's needed to fulfill the type
const URL_TO_FEED_ITEM_TYPE = { annotations: 'annotation', comments: 'comment', tasks: 'task', versions: undefined };

// Default sidebar views in order (excluding BoxAI which is handled dynamically)
const DEFAULT_SIDEBAR_VIEWS = [
    SIDEBAR_VIEW_DOCGEN,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
];

const LoadableActivitySidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_ACTIVITY,
    MARK_NAME_JS_LOADING_ACTIVITY,
);
const LoadableBoxAISidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_BOXAI, MARK_NAME_JS_LOADING_BOXAI);
const LoadableDetailsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DETAILS, MARK_NAME_JS_LOADING_DETAILS);
const LoadableDocGenSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DOCGEN, MARK_NAME_JS_LOADING_DOCGEN);
const LoadableMetadataSidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_METADATA,
    MARK_NAME_JS_LOADING_METADATA,
);
const LoadableMetadataSidebarRedesigned = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_METADATA_REDESIGN,
    MARK_NAME_JS_LOADING_METADATA,
);
const LoadableSkillsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_SKILLS, MARK_NAME_JS_LOADING_SKILLS);
const LoadableVersionsSidebar = SidebarUtils.getAsyncSidebarContent(
    SIDEBAR_VIEW_VERSIONS,
    MARK_NAME_JS_LOADING_VERSIONS,
);

const SIDEBAR_PATH_VERSIONS = '/:sidebar(activity|details)/versions/:versionId?';
const SIDEBAR_PATH_ANNOTATIONS = '/:sidebar/annotations/:fileVersionId/:annotationId?';

class SidebarPanelsRouter extends React.Component<Props, State> {
    boxAISidebar: ElementRefType = React.createRef();

    activitySidebar: ElementRefType = React.createRef();

    detailsSidebar: ElementRefType = React.createRef();

    customSidebars: Map<string, ElementRefType> = new Map();

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

        // Leaving versions: tag annotation-thread exits so compare can stay open.
        if (onVersionChange && this.getVersionsMatchPath(prevLocation) && !this.getVersionsMatchPath(location)) {
            if (matchPath(location.pathname, SIDEBAR_PATH_ANNOTATIONS)) {
                onVersionChange(null, { triggeredBy: 'annotation' });
            } else {
                onVersionChange(null);
            }
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

    setBoxAiSidebarCacheValue = (
        key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestedQuestions',
        value: any,
    ) => {
        this.boxAiSidebarCache[key] = value;
    };

    getCustomSidebarRef = (panelId: string): ElementRefType => {
        if (!this.customSidebars.has(panelId)) {
            this.customSidebars.set(panelId, React.createRef());
        }
        // Flow doesn't understand that we just set the value above, so we need to assert it exists
        const ref = this.customSidebars.get(panelId);
        if (!ref) {
            throw new Error(`Failed to get or create ref for panel ${panelId}`);
        }
        return ref;
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

        // Refresh all custom sidebars (refresh is optional)
        this.customSidebars.forEach(ref => {
            if (ref.current && ref.current.refresh) {
                ref.current.refresh();
            }
        });

        if (metadataSidebar) {
            metadataSidebar.refresh();
        }

        if (versionsSidebar) {
            versionsSidebar.refresh();
        }
    }

    getPanelOrder = (
        customSidebarPanels: Array<CustomSidebarPanel> = [],
        shouldBoxAIBeDefaultPanel: boolean,
        hasNativeBoxAISidebar: boolean,
    ): string[] => {
        const customPanelPaths = customSidebarPanels.map(panel => panel.path);
        const hasCustomBoxAIPanel = customSidebarPanels.some(({ id }) => id === SIDEBAR_VIEW_BOXAI);
        const nonBoxAIPaths = customPanelPaths.filter(path => path !== SIDEBAR_VIEW_BOXAI);

        if (hasNativeBoxAISidebar || hasCustomBoxAIPanel) {
            return [SIDEBAR_VIEW_BOXAI, ...DEFAULT_SIDEBAR_VIEWS, ...nonBoxAIPaths];
        }

        return [...DEFAULT_SIDEBAR_VIEWS, ...customPanelPaths];
    };

    render() {
        const {
            activitySidebarProps,
            boxAISidebarProps,
            customSidebarPanels,
            currentUser,
            currentUserError,
            defaultPanel = '',
            shouldFetchSidebarData,
            detailsSidebarProps,
            docGenSidebarProps,
            elementId,
            features,
            file,
            fileId,
            getComparedPreview,
            getPreview,
            getViewer,
            hasActivity,
            hasNativeBoxAISidebar,
            hasDetails,
            hasDocGen,
            hasMetadata,
            hasSkills,
            hasVersions,
            isOpen,
            metadataSidebarProps,
            onAnnotationSelect,
            onCommentVersionSelect,
            onVersionChange,
            onVersionHistoryClick,
            versionsSidebarProps,
        }: Props = this.props;

        const { isInitialized } = this.state;

        const isMetadataSidebarRedesignEnabled = isFeatureEnabled(features, 'metadata.redesign.enabled');
        const isMetadataAiSuggestionsEnabled = isFeatureEnabled(features, 'metadata.aiSuggestions.enabled');
        const { shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel, showOnlyNavButton: showOnlyBoxAINavButton } =
            getFeatureConfig(features, 'boxai.sidebar');

        const canShowBoxAISidebarPanel = hasNativeBoxAISidebar && !showOnlyBoxAINavButton;

        const hasCustomPanels = customSidebarPanels.length > 0;

        const customPanelsEligibility = {};
        customSidebarPanels.forEach(({ path, isDisabled }) => {
            customPanelsEligibility[path] = !isDisabled;
        });

        const panelsEligibility = {
            [SIDEBAR_VIEW_BOXAI]: canShowBoxAISidebarPanel,
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
            ...customPanelsEligibility,
        };

        const showDefaultPanel: boolean = !!(defaultPanel && panelsEligibility[defaultPanel]);

        if (
            !isOpen ||
            (!hasActivity &&
                !canShowBoxAISidebarPanel &&
                !hasDetails &&
                !hasMetadata &&
                !hasSkills &&
                !hasDocGen &&
                !hasVersions &&
                !hasCustomPanels)
        ) {
            return null;
        }

        return (
            <Switch>
                {/* Native Box AI route - only shown when no custom Box AI panel exists */}
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
                {hasCustomPanels &&
                    customSidebarPanels.map(customPanel => {
                        const {
                            id: customPanelId,
                            path: customPanelPath,
                            component: CustomPanelComponent,
                            isDisabled,
                        } = customPanel;

                        return isDisabled ? null : (
                            <Route
                                exact
                                key={customPanelId}
                                path={`/${customPanelPath}`}
                                render={() => {
                                    this.handlePanelRender(customPanelPath);
                                    return (
                                        <CustomPanelComponent
                                            elementId={elementId}
                                            file={file}
                                            fileId={fileId}
                                            fileExtension={file.extension}
                                            hasSidebarInitialized={isInitialized}
                                            ref={this.getCustomSidebarRef(customPanelId)}
                                        />
                                    );
                                }}
                            />
                        );
                    })}
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
                                    shouldFetchSidebarData={shouldFetchSidebarData}
                                    elementId={elementId}
                                    currentUser={currentUser}
                                    currentUserError={currentUserError}
                                    file={file}
                                    getComparedPreview={getComparedPreview}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    hasSidebarInitialized={isInitialized}
                                    onAnnotationSelect={onAnnotationSelect}
                                    onCommentVersionSelect={onCommentVersionSelect}
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
                                    getPreview={getPreview}
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
                        } else {
                            // Use panel order to determine redirect
                            const panelOrder = this.getPanelOrder(
                                customSidebarPanels,
                                shouldBoxAIBeDefaultPanel,
                                hasNativeBoxAISidebar,
                            );
                            const firstEligiblePanel = panelOrder.find(panel => panelsEligibility[panel]);
                            if (firstEligiblePanel) {
                                redirect = firstEligiblePanel;
                            }
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

    customSidebars: Map<string, ElementRefType> = new Map();

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
        this.redirectToDefaultSidebar();
    }

    componentDidUpdate(prevProps: Props): void {
        const { onVersionChange, internalSidebarNavigation } = this.props;
        const { internalSidebarNavigation: prevInternalSidebarNavigation } = prevProps;

        // Leaving versions: tag annotation-thread exits so compare can stay open.
        if (onVersionChange) {
            const wasPreviousNavigationVersions = this.isVersionsNavigationPath(prevInternalSidebarNavigation);
            const isCurrentNavigationVersions = this.isVersionsNavigationPath(internalSidebarNavigation);

            if (wasPreviousNavigationVersions && !isCurrentNavigationVersions) {
                if (this.isAnnotationsNavigationPath(internalSidebarNavigation)) {
                    onVersionChange(null, { triggeredBy: 'annotation' });
                } else {
                    onVersionChange(null);
                }
            }
        }

        // Internal state updates (e.g. isInitialized) do not affect which sidebar should be rendered
        if (prevProps !== this.props) {
            this.redirectToDefaultSidebar();
        }
    }

    isVersionsNavigationPath = (navigation?: InternalSidebarNavigation): boolean => {
        if (!navigation) {
            return false;
        }
        const { sidebar, activeFeedEntryType } = navigation;
        return (
            (sidebar === ViewType.ACTIVITY || sidebar === ViewType.DETAILS) &&
            activeFeedEntryType === FeedEntryType.VERSIONS
        );
    };

    isAnnotationsNavigationPath = (navigation?: InternalSidebarNavigation): boolean => {
        if (!navigation) {
            return false;
        }
        const { activeFeedEntryType, fileVersionId } = navigation;
        return activeFeedEntryType === FeedEntryType.ANNOTATIONS && !!fileVersionId;
    };

    handlePanelRender = (panel: string): void => {
        const { onPanelChange = noop } = this.props;
        // Call onPanelChange only once with the initial panel
        if (!this.initialPanel.current) {
            this.initialPanel.current = panel;
            onPanelChange(panel, true);
        }
    };

    setBoxAiSidebarCacheValue = (
        key: 'agents' | 'encodedSession' | 'questions' | 'shouldShowLandingPage' | 'suggestedQuestions',
        value: any,
    ) => {
        this.boxAiSidebarCache[key] = value;
    };

    getCustomSidebarRef = (panelId: string): ElementRefType => {
        if (!this.customSidebars.has(panelId)) {
            this.customSidebars.set(panelId, React.createRef());
        }
        // Flow doesn't understand that we just set the value above, so we need to assert it exists
        const ref = this.customSidebars.get(panelId);
        if (!ref) {
            throw new Error(`Failed to get or create ref for panel ${panelId}`);
        }
        return ref;
    };

    getCustomPanel = (path: string): ?CustomSidebarPanel => {
        const { customSidebarPanels = [] } = this.props;
        return customSidebarPanels.find(customPanel => !customPanel.isDisabled && customPanel.path === path);
    };

    getPanelOrder = (
        customSidebarPanels: Array<CustomSidebarPanel> = [],
        shouldBoxAIBeDefaultPanel: boolean,
        hasNativeBoxAISidebar: boolean,
    ): string[] => {
        const customPanelPaths = customSidebarPanels.map(panel => panel.path);
        const hasCustomBoxAIPanel = customSidebarPanels.some(({ id }) => id === SIDEBAR_VIEW_BOXAI);
        const nonBoxAIPaths = customPanelPaths.filter(path => path !== SIDEBAR_VIEW_BOXAI);

        if (hasNativeBoxAISidebar || hasCustomBoxAIPanel) {
            return [SIDEBAR_VIEW_BOXAI, ...DEFAULT_SIDEBAR_VIEWS, ...nonBoxAIPaths];
        }

        return [...DEFAULT_SIDEBAR_VIEWS, ...customPanelPaths];
    };

    canShowBoxAISidebarPanel = (): boolean => {
        const { features, hasNativeBoxAISidebar } = this.props;
        const { showOnlyNavButton: showOnlyBoxAINavButton } = getFeatureConfig(features, 'boxai.sidebar');

        return hasNativeBoxAISidebar && !showOnlyBoxAINavButton;
    };

    getPanelsEligibility = (): { [string]: boolean } => {
        const { customSidebarPanels = [], hasActivity, hasDetails, hasDocGen, hasMetadata, hasSkills } = this.props;

        const customPanelsEligibility = {};
        customSidebarPanels.forEach(({ path, isDisabled }) => {
            customPanelsEligibility[path] = !isDisabled;
        });

        return {
            [SIDEBAR_VIEW_BOXAI]: this.canShowBoxAISidebarPanel(),
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
            ...customPanelsEligibility,
        };
    };

    hasAnySidebar = (): boolean => {
        const {
            customSidebarPanels = [],
            hasActivity,
            hasDetails,
            hasDocGen,
            hasMetadata,
            hasSkills,
            hasVersions,
        } = this.props;

        return (
            hasActivity ||
            this.canShowBoxAISidebarPanel() ||
            hasDetails ||
            hasMetadata ||
            hasSkills ||
            hasDocGen ||
            hasVersions ||
            customSidebarPanels.length > 0
        );
    };

    /**
     * Finds the sidebar matching the current navigation, same as the routes of the router version
     * @returns {string|null} matching sidebar or null if the navigation does not point to any eligible sidebar
     */
    getMatchedSidebar = (): string | null => {
        const { hasActivity, hasDetails, hasDocGen, hasMetadata, hasSkills, hasVersions, internalSidebarNavigation } =
            this.props;

        const currentSidebar = internalSidebarNavigation?.sidebar;
        const versionId = internalSidebarNavigation?.versionId;
        const activeFeedEntryType = internalSidebarNavigation?.activeFeedEntryType;

        // Native Box AI takes precedence over a custom Box AI panel, same as the route order
        if (currentSidebar === SIDEBAR_VIEW_BOXAI && this.canShowBoxAISidebarPanel()) {
            return SIDEBAR_VIEW_BOXAI;
        }

        if (currentSidebar && this.getCustomPanel(currentSidebar)) {
            return currentSidebar;
        }

        if (currentSidebar === SIDEBAR_VIEW_SKILLS && hasSkills) {
            return SIDEBAR_VIEW_SKILLS;
        }

        if (currentSidebar === SIDEBAR_VIEW_ACTIVITY && hasActivity) {
            if (
                activeFeedEntryType === undefined ||
                activeFeedEntryType === FeedEntryType.COMMENTS ||
                activeFeedEntryType === FeedEntryType.TASKS ||
                (activeFeedEntryType === FeedEntryType.ANNOTATIONS && internalSidebarNavigation?.fileVersionId)
            ) {
                return SIDEBAR_VIEW_ACTIVITY;
            }
        }

        if (
            currentSidebar === SIDEBAR_VIEW_DETAILS &&
            hasDetails &&
            activeFeedEntryType !== FeedEntryType.VERSIONS &&
            versionId === undefined
        ) {
            return SIDEBAR_VIEW_DETAILS;
        }

        if (currentSidebar === SIDEBAR_VIEW_METADATA && hasMetadata) {
            return SIDEBAR_VIEW_METADATA;
        }

        if (currentSidebar === SIDEBAR_VIEW_DOCGEN && hasDocGen) {
            return SIDEBAR_VIEW_DOCGEN;
        }

        if (
            hasVersions &&
            (currentSidebar === SIDEBAR_VIEW_ACTIVITY || currentSidebar === SIDEBAR_VIEW_DETAILS) &&
            activeFeedEntryType === FeedEntryType.VERSIONS
        ) {
            return SIDEBAR_VIEW_VERSIONS;
        }

        return null;
    };

    /**
     * Determines the default sidebar using the same logic as the redirect of the router version
     * @returns {string|null} default sidebar or null if none of the sidebars is eligible
     */
    getDefaultSidebar = (): string | null => {
        const { customSidebarPanels = [], defaultPanel, features, hasNativeBoxAISidebar } = this.props;
        const { shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel } = getFeatureConfig(features, 'boxai.sidebar');
        const panelsEligibility = this.getPanelsEligibility();

        if (defaultPanel && panelsEligibility[defaultPanel]) {
            return defaultPanel;
        }

        const panelOrder = this.getPanelOrder(customSidebarPanels, shouldBoxAIBeDefaultPanel, hasNativeBoxAISidebar);
        return panelOrder.find(panel => panelsEligibility[panel]) || null;
    };

    findSidebarToRender = (): string | null => {
        const { isOpen } = this.props;

        if (!isOpen || !this.hasAnySidebar()) {
            return null;
        }

        return this.getMatchedSidebar() || this.getDefaultSidebar();
    };

    /**
     * Replaces the current navigation with the default sidebar when the navigation does not point
     * to any eligible sidebar - the router-less counterpart of the router version's Redirect
     * @returns {void}
     */
    redirectToDefaultSidebar = (): void => {
        const { internalSidebarNavigationHandler, isOpen } = this.props;

        if (!internalSidebarNavigationHandler || !isOpen || !this.hasAnySidebar() || this.getMatchedSidebar()) {
            return;
        }

        const defaultSidebar = this.getDefaultSidebar();

        if (defaultSidebar) {
            internalSidebarNavigationHandler({ sidebar: defaultSidebar, silent: true }, true);
        }
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

        // Refresh all custom sidebars (refresh is optional)
        this.customSidebars.forEach(ref => {
            if (ref.current && ref.current.refresh) {
                ref.current.refresh();
            }
        });

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
            getComparedPreview,
            getPreview,
            getViewer,
            hasVersions,
            internalSidebarNavigation,
            internalSidebarNavigationHandler,
            metadataSidebarProps,
            onAnnotationSelect,
            onCommentVersionSelect,
            onVersionChange,
            onVersionHistoryClick,
            shouldFetchSidebarData,
            versionsSidebarProps,
        } = this.props;

        const { isInitialized } = this.state;

        const sidebarToRender = this.findSidebarToRender();

        if (sidebarToRender) {
            if (sidebarToRender === SIDEBAR_VIEW_VERSIONS) {
                const parentName = internalSidebarNavigation?.sidebar;
                if (parentName) {
                    this.handlePanelRender(parentName);
                }
            } else {
                this.handlePanelRender(sidebarToRender);
            }
        }

        // Render the appropriate sidebar based on currentSidebar
        // Native Box AI - only rendered when it can be shown, otherwise custom Box AI panel is used
        if (sidebarToRender === SIDEBAR_VIEW_BOXAI && this.canShowBoxAISidebarPanel()) {
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

        const customPanel = sidebarToRender ? this.getCustomPanel(sidebarToRender) : null;

        if (customPanel) {
            const { id: customPanelId, component: CustomPanelComponent } = customPanel;

            return (
                <CustomPanelComponent
                    elementId={elementId}
                    file={file}
                    fileId={fileId}
                    fileExtension={file.extension}
                    hasSidebarInitialized={isInitialized}
                    key={customPanelId}
                    ref={this.getCustomSidebarRef(customPanelId)}
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
                    shouldFetchSidebarData={shouldFetchSidebarData}
                    elementId={elementId}
                    currentUser={currentUser}
                    currentUserError={currentUserError}
                    file={file}
                    getComparedPreview={getComparedPreview}
                    getPreview={getPreview}
                    getViewer={getViewer}
                    hasSidebarInitialized={isInitialized}
                    onAnnotationSelect={onAnnotationSelect}
                    onCommentVersionSelect={onCommentVersionSelect}
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
                    getPreview={getPreview}
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
    sidebarPanels: ElementRefType = React.createRef();

    /**
     * Refreshes the contents of the active sidebar
     * Needed as parent components (e.g. withSidebarAnnotations) hold a ref to this component
     * @returns {void}
     */
    refresh(shouldRefreshCache: boolean = true): void {
        const { current: sidebarPanels } = this.sidebarPanels;

        if (sidebarPanels) {
            sidebarPanels.refresh(shouldRefreshCache);
        }
    }

    render() {
        const { routerDisabled, ...otherProps } = this.props;

        if (routerDisabled) {
            return <SidebarPanelsRouterDisabled ref={this.sidebarPanels} {...otherProps} />;
        }

        return <SidebarPanelsRouter ref={this.sidebarPanels} {...otherProps} />;
    }
}

export { SidebarPanelsRouter as SidebarPanelsComponent };
export { SidebarPanelsRouterDisabled as SidebarPanelsRouterDisabledComponent };
export { SidebarPanels as SidebarPanelsDispatcherComponent };
export default flow([
    withFeatureConsumer,
    withSidebarAnnotations,
    withAPIContext,
    withAnnotatorContext,
    withRouterAndRef,
])(SidebarPanels);
