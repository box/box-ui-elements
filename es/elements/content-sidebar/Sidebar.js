function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Content Sidebar Component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import { withRouter } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import LocalStore from '../../utils/LocalStore';
import SidebarNav from './SidebarNav';
import SidebarPanels from './SidebarPanels';
import SidebarUtils from './SidebarUtils';
// $FlowFixMe TypeScript file
import ThemingStyles from '../common/theming';
import { withCurrentUser } from '../common/current-user';
import { isFeatureEnabled, withFeatureConsumer } from '../common/feature-checking';

// $FlowFixMe TypeScript file

import { SIDEBAR_VIEW_DOCGEN } from '../../constants';
import API from '../../api';
export const SIDEBAR_FORCE_KEY = 'bcs.force';
export const SIDEBAR_FORCE_VALUE_CLOSED = 'closed';
export const SIDEBAR_FORCE_VALUE_OPEN = 'open';
export const SIDEBAR_SELECTED_PANEL_KEY = 'sidebar-selected-panel';
class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "id", uniqueid('bcs_'));
    _defineProperty(this, "sidebarPanels", /*#__PURE__*/React.createRef());
    _defineProperty(this, "store", new LocalStore());
    _defineProperty(this, "handleDocgenTemplateOnUpdate", prevProps => {
      const {
        history,
        location,
        file,
        api,
        metadataSidebarProps,
        docGenSidebarProps
      } = this.props;
      const {
        file: prevFile,
        docGenSidebarProps: prevDocGenSidebarProps
      } = prevProps;
      // need to re-check if file is a docgen-template on file change
      if (file.id !== prevFile.id && docGenSidebarProps.enabled && docGenSidebarProps.checkDocGenTemplate) {
        docGenSidebarProps.checkDocGenTemplate(api, file, metadataSidebarProps.isFeatureEnabled);
      }
      // if file turns out to be a docgen template
      if (docGenSidebarProps.enabled && prevDocGenSidebarProps.isDocGenTemplate !== docGenSidebarProps.isDocGenTemplate) {
        if (docGenSidebarProps.isDocGenTemplate) {
          // navigate to docgen tab
          history.push(`/${SIDEBAR_VIEW_DOCGEN}`);
        } else if (location.pathname === `/${SIDEBAR_VIEW_DOCGEN}`) {
          history.push('/');
        }
      }
    });
    _defineProperty(this, "getUrlPrefix", pathname => {
      const basePath = pathname.substring(1).split('/')[0];
      return basePath;
    });
    /**
     * Handle version history click
     *
     * @param {SyntheticEvent} event - The event
     * @return {void}
     */
    _defineProperty(this, "handleVersionHistoryClick", event => {
      const {
        file,
        history
      } = this.props;
      const {
        file_version: currentVersion
      } = file;
      const fileVersionSlug = currentVersion ? `/${currentVersion.id}` : '';
      const urlPrefix = this.getUrlPrefix(history.location.pathname);
      if (event.preventDefault) {
        event.preventDefault();
      }
      history.push(`/${urlPrefix}/versions${fileVersionSlug}`);
    });
    _defineProperty(this, "handlePanelChange", (name, isInitialState) => {
      const {
        features,
        onPanelChange = noop
      } = this.props;
      // We don't need to preserve panel if it's the initial state
      if (isFeatureEnabled(features, 'panelSelectionPreservation') && !isInitialState) {
        this.store.setItem(SIDEBAR_SELECTED_PANEL_KEY, name);
      }
      onPanelChange(name, isInitialState);
    });
    this.state = {
      isDirty: this.getLocationState('open') || false
    };
    this.setForcedByLocation();
  }
  componentDidMount() {
    const {
      file,
      api,
      metadataSidebarProps,
      docGenSidebarProps,
      onOpenChange = noop
    } = this.props;
    // if docgen feature is enabled, load metadata to check whether file is a docgen template
    if (docGenSidebarProps.enabled) {
      docGenSidebarProps.checkDocGenTemplate(api, file, metadataSidebarProps.isFeatureEnabled);
    }
    onOpenChange(this.isOpen(), true);
  }
  componentDidUpdate(prevProps) {
    const {
      fileId,
      history,
      location,
      onOpenChange = noop
    } = this.props;
    const {
      fileId: prevFileId,
      location: prevLocation
    } = prevProps;
    const {
      isDirty
    } = this.state;

    // User navigated to a different file without ever navigating the sidebar
    if (!isDirty && fileId !== prevFileId && location.pathname !== '/') {
      history.replace({
        pathname: '/',
        state: {
          silent: true
        }
      });
    }

    // User navigated or toggled the sidebar intentionally, internally or externally
    if (location !== prevLocation && !this.getLocationState('silent')) {
      this.setForcedByLocation();
      this.setState({
        isDirty: true
      });
      const openState = this.getLocationState('open');
      // Check if the sidebar was expanded / collapsed
      if (prevLocation.state?.open !== openState) {
        onOpenChange(openState, false);
      }
    }
    this.handleDocgenTemplateOnUpdate(prevProps);
  }
  /**
   * Getter for location state properties.
   *
   * NOTE: Each location on the history stack has its own optional state object that is wholly separate from
   * this component's internal state. Values on the location state object can persist even between refreshes
   * when using certain history contexts, such as BrowserHistory.
   *
   * @param key - Optionally get a specific key value from state
   * @returns {any} - The location state or state key value
   */
  getLocationState(key) {
    const {
      location
    } = this.props;
    const {
      state: locationState = {}
    } = location;
    return getProp(locationState, key);
  }

  /**
   * Getter/setter for sidebar forced state
   *
   * @param isOpen - Optionally set the sidebar to open/closed
   * @returns {string|null} - The sidebar open/closed state
   */
  isForced(isOpen) {
    if (isOpen !== undefined) {
      this.store.setItem(SIDEBAR_FORCE_KEY, isOpen ? SIDEBAR_FORCE_VALUE_OPEN : SIDEBAR_FORCE_VALUE_CLOSED);
    }
    return this.store.getItem(SIDEBAR_FORCE_KEY);
  }

  /**
   * Getter for whether the sidebar has been forced open
   * @returns {boolean} - True if the sidebar has been forced open
   */
  isForcedOpen() {
    return this.isForced() === SIDEBAR_FORCE_VALUE_OPEN;
  }

  /**
   * Getter for whether the sidebar has been forced open/closed previously
   * @returns {boolean} - True if the sidebar has been forced open/closed previously
   */
  isForcedSet() {
    return this.isForced() !== null;
  }

  /**
   * Getter for sidebar current open state
   * @returns {boolean} - True if the sidebar is open
   */
  isOpen() {
    const {
      isDefaultOpen
    } = this.props;
    return this.isForcedSet() ? this.isForcedOpen() : !!isDefaultOpen;
  }

  /**
   * Refreshes the sidebar panel
   * @returns {void}
   */
  refresh(shouldRefreshCache = true) {
    const {
      current: sidebarPanels
    } = this.sidebarPanels;
    if (sidebarPanels) {
      sidebarPanels.refresh(shouldRefreshCache);
    }
  }

  /**
   * Helper to set the local store open state based on the location open state, if defined
   */
  setForcedByLocation() {
    const isLocationOpen = this.getLocationState('open');
    if (isLocationOpen !== undefined && isLocationOpen !== null) {
      this.isForced(isLocationOpen);
    }
  }
  getDefaultPanel() {
    const {
      features
    } = this.props;
    if (!isFeatureEnabled(features, 'panelSelectionPreservation')) {
      return undefined;
    }
    return this.store.getItem(SIDEBAR_SELECTED_PANEL_KEY) || undefined;
  }
  render() {
    const {
      activitySidebarProps,
      additionalTabs,
      boxAISidebarProps,
      className,
      currentUser,
      currentUserError,
      detailsSidebarProps,
      docGenSidebarProps,
      file,
      fileId,
      getPreview,
      getViewer,
      hasAdditionalTabs,
      hasNav,
      hasVersions,
      isLoading,
      metadataEditors,
      metadataSidebarProps,
      onAnnotationSelect,
      onVersionChange,
      signSidebarProps,
      theme,
      versionsSidebarProps
    } = this.props;
    const isOpen = this.isOpen();
    const hasBoxAI = SidebarUtils.canHaveBoxAISidebar(this.props);
    const hasActivity = SidebarUtils.canHaveActivitySidebar(this.props);
    const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
    const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
    const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
    const onVersionHistoryClick = hasVersions ? this.handleVersionHistoryClick : this.props.onVersionHistoryClick;
    const styleClassName = classNames('be bcs', className, {
      'bcs-is-open': isOpen,
      'bcs-is-wider': hasBoxAI
    });
    const defaultPanel = this.getDefaultPanel();
    return /*#__PURE__*/React.createElement("aside", {
      id: this.id,
      className: styleClassName,
      "data-testid": "preview-sidebar"
    }, /*#__PURE__*/React.createElement(ThemingStyles, {
      theme: theme
    }), isLoading ? /*#__PURE__*/React.createElement("div", {
      className: "bcs-loading"
    }, /*#__PURE__*/React.createElement(LoadingIndicator, null)) : /*#__PURE__*/React.createElement(React.Fragment, null, hasNav && /*#__PURE__*/React.createElement(SidebarNav, {
      additionalTabs: additionalTabs,
      elementId: this.id,
      fileId: fileId,
      hasActivity: hasActivity,
      hasAdditionalTabs: hasAdditionalTabs,
      hasBoxAI: hasBoxAI,
      hasDetails: hasDetails,
      hasMetadata: hasMetadata,
      hasSkills: hasSkills,
      hasDocGen: docGenSidebarProps.isDocGenTemplate,
      isOpen: isOpen,
      onPanelChange: this.handlePanelChange,
      signSidebarProps: signSidebarProps
    }), /*#__PURE__*/React.createElement(SidebarPanels, {
      activitySidebarProps: activitySidebarProps,
      boxAISidebarProps: boxAISidebarProps,
      currentUser: currentUser,
      currentUserError: currentUserError,
      elementId: this.id,
      defaultPanel: defaultPanel,
      detailsSidebarProps: detailsSidebarProps,
      docGenSidebarProps: docGenSidebarProps,
      file: file,
      fileId: fileId,
      getPreview: getPreview,
      getViewer: getViewer,
      hasActivity: hasActivity,
      hasBoxAI: hasBoxAI,
      hasDetails: hasDetails,
      hasDocGen: docGenSidebarProps.isDocGenTemplate,
      hasMetadata: hasMetadata,
      hasSkills: hasSkills,
      hasVersions: hasVersions,
      isOpen: isOpen,
      key: file.id,
      metadataSidebarProps: metadataSidebarProps,
      onAnnotationSelect: onAnnotationSelect,
      onPanelChange: this.handlePanelChange,
      onVersionChange: onVersionChange,
      onVersionHistoryClick: onVersionHistoryClick,
      ref: this.sidebarPanels,
      versionsSidebarProps: versionsSidebarProps
    })));
  }
}
_defineProperty(Sidebar, "defaultProps", {
  annotatorState: {},
  isDefaultOpen: true,
  isLoading: false,
  getAnnotationsMatchPath: noop,
  getAnnotationsPath: noop
});
export { Sidebar as SidebarComponent };
export default flow([withCurrentUser, withFeatureConsumer, withRouter])(Sidebar);
//# sourceMappingURL=Sidebar.js.map