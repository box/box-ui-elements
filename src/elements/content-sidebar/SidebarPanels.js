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

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    boxAISidebarProps: BoxAISidebarProps,
    customPanels?: Array<CustomSidebarPanel>,
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
    isOpen: boolean,
    location: Location,
    metadataSidebarProps: MetadataSidebarProps,
    onAnnotationSelect?: Function,
    onPanelChange?: (name: string, isInitialState?: boolean) => void,
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

// Default sidebar views in order (excluding BoxAI which is handled dynamically)
const DEFAULT_SIDEBAR_VIEWS = [
    SIDEBAR_VIEW_DOCGEN,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
];

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

        // Refresh all custom sidebars
        this.customSidebars.forEach(ref => {
            if (ref.current) {
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

    getPanelOrder = (customPanels?: Array<CustomSidebarPanel>, shouldBoxAIBeDefaultPanel: boolean): string[] => {
        // No custom panels - return default panels
        if (!customPanels || customPanels.length === 0) {
            return DEFAULT_SIDEBAR_VIEWS;
        }

        // Separate box-ai custom panel from other custom panels
        const boxAiCustomPanel = customPanels.find(panel => panel.id === SIDEBAR_VIEW_BOXAI);
        const otherCustomPanels = customPanels.filter(panel => panel.id !== SIDEBAR_VIEW_BOXAI);
        const otherCustomPanelPaths = otherCustomPanels.map(panel => panel.path);

        if (boxAiCustomPanel && shouldBoxAIBeDefaultPanel) {
            return [boxAiCustomPanel.path, ...DEFAULT_SIDEBAR_VIEWS, ...otherCustomPanelPaths];
        }

        return [...DEFAULT_SIDEBAR_VIEWS, ...customPanels.map(panel => panel.path)];
    };

    render() {
        const {
            activitySidebarProps,
            customPanels,
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
        const { shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel } = getFeatureConfig(features, 'boxai.sidebar');

        const hasCustomPanels = customPanels && customPanels.length > 0;

        // Build eligibility for custom panels
        const customPanelEligibility = {};
        if (hasCustomPanels) {
            // $FlowFixMe: customPanels is checked for existence in hasCustomPanels
            customPanels.forEach(({ path, isDisabled }) => {
                customPanelEligibility[path] = !isDisabled;
            });
        }

        const panelsEligibility = {
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
            ...customPanelEligibility,
        };

        const showDefaultPanel: boolean = !!(defaultPanel && panelsEligibility[defaultPanel]);

        if (
            !isOpen ||
            (!hasActivity &&
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
                {hasCustomPanels &&
                    // $FlowFixMe: customPanels is checked for existence in hasCustomPanels
                    customPanels.map(customPanel => {
                        const {
                            id: customPanelId,
                            path: customPanelPath,
                            component: CustomPanelComponent,
                            isDisabled,
                        } = customPanel;

                        if (isDisabled || !CustomPanelComponent) {
                            return null;
                        }

                        return (
                            <Route
                                exact
                                key={customPanelId}
                                path={`/${customPanelPath}`}
                                render={() => {
                                    this.handlePanelRender(customPanelPath);
                                    return CustomPanelComponent ? (
                                        <CustomPanelComponent
                                            elementId={elementId}
                                            key={file.id}
                                            fileExtension={file.extension}
                                            hasSidebarInitialized={isInitialized}
                                            ref={this.getCustomSidebarRef(customPanelId)}
                                        />
                                    ) : null;
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
                        } else {
                            // Use panel order to determine redirect
                            const panelOrder = this.getPanelOrder(customPanels, shouldBoxAIBeDefaultPanel);
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

export { SidebarPanels as SidebarPanelsComponent };
export default flow([
    withFeatureConsumer,
    withSidebarAnnotations,
    withAPIContext,
    withAnnotatorContext,
    withRouterAndRef,
])(SidebarPanels);
