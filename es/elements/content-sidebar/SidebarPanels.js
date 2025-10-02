function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Content Sidebar Panels component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import { matchPath, Redirect, Route, Switch } from 'react-router-dom';
import SidebarUtils from './SidebarUtils';
import withSidebarAnnotations from './withSidebarAnnotations';
import { withAnnotatorContext } from '../common/annotator-context';
import { withAPIContext } from '../common/api-context';
import { getFeatureConfig, withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withRouterAndRef } from '../common/routing';
import { ORIGIN_ACTIVITY_SIDEBAR, ORIGIN_DETAILS_SIDEBAR, ORIGIN_DOCGEN_SIDEBAR, ORIGIN_METADATA_SIDEBAR, ORIGIN_METADATA_SIDEBAR_REDESIGN, ORIGIN_SKILLS_SIDEBAR, ORIGIN_VERSIONS_SIDEBAR, SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_METADATA, SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_VERSIONS, SIDEBAR_VIEW_DOCGEN, SIDEBAR_VIEW_METADATA_REDESIGN, SIDEBAR_VIEW_BOXAI, ORIGIN_BOXAI_SIDEBAR } from '../../constants';
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
const URL_TO_FEED_ITEM_TYPE = {
  annotations: 'annotation',
  comments: 'comment',
  tasks: 'task'
};
const LoadableDetailsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DETAILS, MARK_NAME_JS_LOADING_DETAILS);
const LoadableActivitySidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_ACTIVITY, MARK_NAME_JS_LOADING_ACTIVITY);
const LoadableBoxAISidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_BOXAI, MARK_NAME_JS_LOADING_BOXAI);
const LoadableSkillsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_SKILLS, MARK_NAME_JS_LOADING_SKILLS);
const LoadableMetadataSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_METADATA, MARK_NAME_JS_LOADING_METADATA);
const LoadableMetadataSidebarRedesigned = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_METADATA_REDESIGN, MARK_NAME_JS_LOADING_METADATA);
const LoadableDocGenSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_DOCGEN, MARK_NAME_JS_LOADING_DOCGEN);
const LoadableVersionsSidebar = SidebarUtils.getAsyncSidebarContent(SIDEBAR_VIEW_VERSIONS, MARK_NAME_JS_LOADING_VERSIONS);
const SIDEBAR_PATH_VERSIONS = '/:sidebar(activity|details)/versions/:versionId?';
class SidebarPanels extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "boxAISidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "activitySidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "detailsSidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "initialPanel", /*#__PURE__*/React.createRef());
    _defineProperty(this, "metadataSidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "state", {
      isInitialized: false
    });
    _defineProperty(this, "versionsSidebar", /*#__PURE__*/React.createRef());
    _defineProperty(this, "boxAiSidebarCache", {
      agents: {
        agents: [],
        selectedAgent: null,
        requestState: 'not_started'
      },
      encodedSession: null,
      questions: [],
      shouldShowLandingPage: true,
      suggestedQuestions: []
    });
    _defineProperty(this, "getVersionsMatchPath", location => {
      const {
        pathname
      } = location;
      return matchPath(pathname, SIDEBAR_PATH_VERSIONS);
    });
    _defineProperty(this, "handlePanelRender", panel => {
      const {
        onPanelChange = noop
      } = this.props;
      // Call onPanelChange only once with the initial panel
      if (!this.initialPanel.current) {
        this.initialPanel.current = panel;
        onPanelChange(panel, true);
      }
    });
    _defineProperty(this, "setBoxAiSidebarCacheValue", (key, value) => {
      this.boxAiSidebarCache[key] = value;
    });
  }
  componentDidMount() {
    this.setState({
      isInitialized: true
    });
  }
  componentDidUpdate(prevProps) {
    const {
      location,
      onVersionChange
    } = this.props;
    const {
      location: prevLocation
    } = prevProps;

    // Reset the current version id if the wrapping versions route is no longer active
    if (onVersionChange && this.getVersionsMatchPath(prevLocation) && !this.getVersionsMatchPath(location)) {
      onVersionChange(null);
    }
  }
  /**
   * Refreshes the contents of the active sidebar
   * @returns {void}
   */
  refresh(shouldRefreshCache = true) {
    const {
      current: boxAISidebar
    } = this.boxAISidebar;
    const {
      current: activitySidebar
    } = this.activitySidebar;
    const {
      current: detailsSidebar
    } = this.detailsSidebar;
    const {
      current: metadataSidebar
    } = this.metadataSidebar;
    const {
      current: versionsSidebar
    } = this.versionsSidebar;
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
      versionsSidebarProps
    } = this.props;
    const {
      isInitialized
    } = this.state;
    const isMetadataSidebarRedesignEnabled = isFeatureEnabled(features, 'metadata.redesign.enabled');
    const isMetadataAiSuggestionsEnabled = isFeatureEnabled(features, 'metadata.aiSuggestions.enabled');
    const {
      shouldBeDefaultPanel: shouldBoxAIBeDefaultPanel,
      showOnlyNavButton: showOnlyBoxAINavButton
    } = getFeatureConfig(features, 'boxai.sidebar');
    const canShowBoxAISidebarPanel = hasBoxAI && !showOnlyBoxAINavButton;
    const panelsEligibility = {
      [SIDEBAR_VIEW_BOXAI]: canShowBoxAISidebarPanel,
      [SIDEBAR_VIEW_DOCGEN]: hasDocGen,
      [SIDEBAR_VIEW_SKILLS]: hasSkills,
      [SIDEBAR_VIEW_ACTIVITY]: hasActivity,
      [SIDEBAR_VIEW_DETAILS]: hasDetails,
      [SIDEBAR_VIEW_METADATA]: hasMetadata
    };
    const showDefaultPanel = !!(defaultPanel && panelsEligibility[defaultPanel]);
    if (!isOpen || !hasBoxAI && !hasActivity && !hasDetails && !hasMetadata && !hasSkills && !hasVersions) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Switch, null, canShowBoxAISidebarPanel && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: `/${SIDEBAR_VIEW_BOXAI}`,
      render: () => {
        this.handlePanelRender(SIDEBAR_VIEW_BOXAI);
        return /*#__PURE__*/React.createElement(LoadableBoxAISidebar, _extends({
          contentName: file.name,
          elementId: elementId,
          fileExtension: file.extension,
          fileID: file.id,
          hasSidebarInitialized: isInitialized,
          ref: this.boxAISidebar,
          startMarkName: MARK_NAME_JS_LOADING_BOXAI,
          cache: this.boxAiSidebarCache,
          setCacheValue: this.setBoxAiSidebarCacheValue
        }, boxAISidebarProps));
      }
    }), hasSkills && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: `/${SIDEBAR_VIEW_SKILLS}`,
      render: () => {
        this.handlePanelRender(SIDEBAR_VIEW_SKILLS);
        return /*#__PURE__*/React.createElement(LoadableSkillsSidebar, {
          elementId: elementId,
          key: file.id,
          file: file,
          getPreview: getPreview,
          getViewer: getViewer,
          hasSidebarInitialized: isInitialized,
          startMarkName: MARK_NAME_JS_LOADING_SKILLS
        });
      }
    }), hasActivity && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: [`/${SIDEBAR_VIEW_ACTIVITY}`, `/${SIDEBAR_VIEW_ACTIVITY}/:activeFeedEntryType(annotations)/:fileVersionId/:activeFeedEntryId?`, `/${SIDEBAR_VIEW_ACTIVITY}/:activeFeedEntryType(comments|tasks)/:activeFeedEntryId?`],
      render: ({
        match
      }) => {
        const matchEntryType = match.params.activeFeedEntryType;
        const activeFeedEntryType = matchEntryType ? URL_TO_FEED_ITEM_TYPE[matchEntryType] : undefined;
        this.handlePanelRender(SIDEBAR_VIEW_ACTIVITY);
        return /*#__PURE__*/React.createElement(LoadableActivitySidebar, _extends({
          elementId: elementId,
          currentUser: currentUser,
          currentUserError: currentUserError,
          file: file,
          hasSidebarInitialized: isInitialized,
          onAnnotationSelect: onAnnotationSelect,
          onVersionChange: onVersionChange,
          onVersionHistoryClick: onVersionHistoryClick,
          ref: this.activitySidebar,
          startMarkName: MARK_NAME_JS_LOADING_ACTIVITY,
          activeFeedEntryId: match.params.activeFeedEntryId,
          activeFeedEntryType: match.params.activeFeedEntryId && activeFeedEntryType
        }, activitySidebarProps));
      }
    }), hasDetails && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: `/${SIDEBAR_VIEW_DETAILS}`,
      render: () => {
        this.handlePanelRender(SIDEBAR_VIEW_DETAILS);
        return /*#__PURE__*/React.createElement(LoadableDetailsSidebar, _extends({
          elementId: elementId,
          fileId: fileId,
          hasSidebarInitialized: isInitialized,
          key: fileId,
          hasVersions: hasVersions,
          onVersionHistoryClick: onVersionHistoryClick,
          ref: this.detailsSidebar,
          startMarkName: MARK_NAME_JS_LOADING_DETAILS
        }, detailsSidebarProps));
      }
    }), hasMetadata && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: [`/${SIDEBAR_VIEW_METADATA}`, `/${SIDEBAR_VIEW_METADATA}/filteredTemplates/:filteredTemplateIds?`],
      render: ({
        match
      }) => {
        this.handlePanelRender(SIDEBAR_VIEW_METADATA);
        return isMetadataSidebarRedesignEnabled ? /*#__PURE__*/React.createElement(LoadableMetadataSidebarRedesigned, _extends({
          elementId: elementId,
          fileExtension: file.extension,
          fileId: fileId,
          filteredTemplateIds: match.params.filteredTemplateIds ? match.params.filteredTemplateIds.split(',') : [],
          hasSidebarInitialized: isInitialized,
          isBoxAiSuggestionsEnabled: isMetadataAiSuggestionsEnabled,
          ref: this.metadataSidebar,
          startMarkName: MARK_NAME_JS_LOADING_METADATA_REDESIGNED
        }, metadataSidebarProps)) : /*#__PURE__*/React.createElement(LoadableMetadataSidebar, _extends({
          elementId: elementId,
          fileId: fileId,
          hasSidebarInitialized: isInitialized,
          ref: this.metadataSidebar,
          startMarkName: MARK_NAME_JS_LOADING_METADATA
        }, metadataSidebarProps));
      }
    }), hasDocGen && /*#__PURE__*/React.createElement(Route, {
      exact: true,
      path: `/${SIDEBAR_VIEW_DOCGEN}`,
      render: () => {
        this.handlePanelRender(SIDEBAR_VIEW_DOCGEN);
        return /*#__PURE__*/React.createElement(LoadableDocGenSidebar, _extends({
          hasSidebarInitialized: isInitialized,
          startMarkName: MARK_NAME_JS_LOADING_DOCGEN
        }, docGenSidebarProps));
      }
    }), hasVersions && /*#__PURE__*/React.createElement(Route, {
      path: SIDEBAR_PATH_VERSIONS,
      render: ({
        match
      }) => {
        if (match.params.sidebar) {
          this.handlePanelRender(match.params.sidebar);
        }
        return /*#__PURE__*/React.createElement(LoadableVersionsSidebar, _extends({
          fileId: fileId,
          hasSidebarInitialized: isInitialized,
          key: fileId,
          onVersionChange: onVersionChange,
          parentName: match.params.sidebar,
          ref: this.versionsSidebar,
          versionId: match.params.versionId
        }, versionsSidebarProps));
      }
    }), /*#__PURE__*/React.createElement(Route, {
      render: () => {
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
        return /*#__PURE__*/React.createElement(Redirect, {
          to: {
            pathname: `/${redirect}`,
            state: {
              silent: true
            }
          }
        });
      }
    }));
  }
}
export { SidebarPanels as SidebarPanelsComponent };
export default flow([withFeatureConsumer, withSidebarAnnotations, withAPIContext, withAnnotatorContext, withRouterAndRef])(SidebarPanels);
//# sourceMappingURL=SidebarPanels.js.map