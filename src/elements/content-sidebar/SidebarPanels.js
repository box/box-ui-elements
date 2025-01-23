/**
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import SidebarUtils from './SidebarUtils';
import { matchPath } from '../common/routing/utils';
import CustomRoute from '../common/routing/customRoute';
import CustomSwitch from '../common/routing/customSwitch';
import CustomRedirect from '../common/routing/customRedirect';
import withSidebarAnnotations from './withSidebarAnnotations';
import { withAnnotatorContext } from '../common/annotator-context';
import { withAPIContext } from '../common/api-context';
import { getFeatureConfig, withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withRouterAndRef } from '../common/routing';

/**
 * @typedef {import('./ActivitySidebar').ActivitySidebarProps} ActivitySidebarProps
 * @typedef {import('./BoxAISidebar').BoxAISidebarProps} BoxAISidebarProps
 * @typedef {import('./DetailsSidebar').DetailsSidebarProps} DetailsSidebarProps
 * @typedef {import('./DocGenSidebar/DocGenSidebar').DocGenSidebarProps} DocGenSidebarProps
 * @typedef {import('./MetadataSidebar').MetadataSidebarProps} MetadataSidebarProps
 * @typedef {import('./versions').VersionsSidebarProps} VersionsSidebarProps
 * @typedef {import('../../common/types/core').User} User
 * @typedef {import('../../common/types/core').BoxItem} BoxItem
 * @typedef {import('../common/flowTypes').Errors} Errors
 * @typedef {import('../common/feature-checking').FeatureConfig} FeatureConfig
 */
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

/** @type {{ current: null | string }} */
const initialPanel = React.createRef();

/** @type {{ isInitialized: boolean }} */
const initialState = { isInitialized: false };

/** @type {Object.<string, React.RefObject<any>>} */
const sidebarRefs = {
    boxAISidebar: React.createRef(),
    activitySidebar: React.createRef(),
    detailsSidebar: React.createRef(),
    metadataSidebar: React.createRef(),
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

/**
 * @typedef {Object} Props
 * @property {ActivitySidebarProps} activitySidebarProps
 * @property {BoxAISidebarProps} boxAISidebarProps
 * @property {User} [currentUser]
 * @property {Errors} [currentUserError]
 * @property {string} [defaultPanel]
 * @property {DetailsSidebarProps} detailsSidebarProps
 * @property {DocGenSidebarProps} docGenSidebarProps
 * @property {string} elementId
 * @property {FeatureConfig} features
 * @property {BoxItem} file
 * @property {string} fileId
 * @property {Function} getPreview
 * @property {Function} getViewer
 * @property {boolean} hasActivity
 * @property {boolean} hasBoxAI
 * @property {boolean} hasDetails
 * @property {boolean} hasDocGen
 * @property {boolean} hasMetadata
 * @property {boolean} hasSkills
 * @property {boolean} hasVersions
 * @property {boolean} isOpen
 * @property {MetadataSidebarProps} metadataSidebarProps
 * @property {Function} [onAnnotationSelect]
 * @property {Function} [onVersionChange]
 * @property {Function} [onVersionHistoryClick]
 * @property {VersionsSidebarProps} versionsSidebarProps
 */

/** @extends {React.Component<Props>} */
class SidebarPanels extends React.Component {
    boxAISidebar = sidebarRefs.boxAISidebar;

    activitySidebar = sidebarRefs.activitySidebar;

    detailsSidebar = sidebarRefs.detailsSidebar;

    initialPanel = initialPanel;

    metadataSidebar = sidebarRefs.metadataSidebar;

    state = initialState;

    /** @type {ElementRefType} */
    versionsSidebar = React.createRef();

    /** @type {{ encodedSession: string | null, questions: QuestionType[] }} */
    boxAiSidebarCache = {
        encodedSession: null,
        questions: [],
    };

    componentDidMount() {
        this.setState({ isInitialized: true });
    }

    /** @param {Props} prevProps */
    componentDidUpdate(prevProps) {
        const { location, onVersionChange } = this.props;
        const { location: prevLocation } = prevProps;

        // Reset the current version id if the wrapping versions route is no longer active
        if (onVersionChange && this.getVersionsMatchPath(prevLocation) && !this.getVersionsMatchPath(location)) {
            onVersionChange(null);
        }
    }

    /** @param {Location} location */
    getVersionsMatchPath = location => {
        const { pathname } = location;
        return matchPath(pathname, SIDEBAR_PATH_VERSIONS);
    };

    /** @param {string} panel */
    handlePanelRender = panel => {
        const { onPanelChange = noop } = this.props;
        // Call onPanelChange only once with the initial panel
        if (!this.initialPanel.current) {
            this.initialPanel.current = panel;
            onPanelChange(panel, true);
        }
    };

    /**
     * @param {'encodedSession' | 'questions'} key
     * @param {any} value
     */
    setBoxAiSidebarCacheValue = (key, value) => {
        this.boxAiSidebarCache[key] = value;
    };

    /**
     * Refreshes the contents of the active sidebar
     * @returns {void}
     */
    /** @param {boolean} [shouldRefreshCache=true] */
    refresh(shouldRefreshCache = true) {
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
        } = this.props;

        const { isInitialized } = this.state;

        const isMetadataSidebarRedesignEnabled = isFeatureEnabled(features, 'metadata.redesign.enabled');
        const isMetadataAiSuggestionsEnabled = isFeatureEnabled(features, 'metadata.aiSuggestions.enabled');

        const { showOnlyNavButton: showOnlyBoxAINavButton } = getFeatureConfig(features, 'boxai.sidebar');

        const canShowBoxAISidebarPanel = hasBoxAI && !showOnlyBoxAINavButton;

        const panelsEligibility = {
            [SIDEBAR_VIEW_BOXAI]: canShowBoxAISidebarPanel,
            [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
            [SIDEBAR_VIEW_SKILLS]: hasSkills,
            [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
            [SIDEBAR_VIEW_DETAILS]: hasDetails,
            [SIDEBAR_VIEW_METADATA]: hasMetadata,
        };

        const showDefaultPanel = !!(defaultPanel && panelsEligibility[defaultPanel]);

        if (!isOpen || (!hasBoxAI && !hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions)) {
            return null;
        }

        return (
            <CustomSwitch>
                {canShowBoxAISidebarPanel && (
                    <CustomRoute
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
                                    userInfo={{ name: currentUser?.name, avatarURL: currentUser?.avatar_url }}
                                    cache={this.boxAiSidebarCache}
                                    setCacheValue={this.setBoxAiSidebarCacheValue}
                                    {...boxAISidebarProps}
                                />
                            );
                        }}
                    />
                )}
                {hasSkills && (
                    <CustomRoute
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
                    <CustomRoute
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
                    <CustomRoute
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
                    <CustomRoute
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
                    <CustomRoute
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
                    <CustomRoute
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
                <CustomRoute
                    render={() => {
                        let redirect = '';

                        if (showDefaultPanel) {
                            redirect = defaultPanel;
                        } else if (canShowBoxAISidebarPanel) {
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
                        }

                        return <CustomRedirect to={{ pathname: `/${redirect}`, state: { silent: true } }} />;
                    }}
                />
            </CustomSwitch>
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
