function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Content Sidebar Container
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import { TooltipProvider } from '@box/blueprint-web';
import API from '../../api';
import APIContext from '../common/api-context';
import Internationalize from '../common/Internationalize';
import Sidebar from './Sidebar';
import NavRouter from '../common/nav-router';
import SidebarUtils from './SidebarUtils';
import { CLIENT_NAME_CONTENT_SIDEBAR, CLIENT_VERSION, DEFAULT_HOSTNAME_API, ORIGIN_CONTENT_SIDEBAR } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE } from '../../utils/fields';
import { withErrorBoundary } from '../common/error-boundary';
// $FlowFixMe
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { isFeatureEnabled as isFeatureEnabledInContext, withFeatureConsumer, withFeatureProvider } from '../common/feature-checking';
import { withLogger } from '../common/logger';

// $FlowFixMe TypeScript file

import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentSidebar.scss';
const MARK_NAME_JS_READY = `${ORIGIN_CONTENT_SIDEBAR}_${EVENT_JS_READY}`;
mark(MARK_NAME_JS_READY);
class ContentSidebar extends React.Component {
  /**
   * [constructor]
   *
   * @private
   * @return {ContentSidebar}
   */
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      isLoading: true
    });
    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @param {string} code - error code
     * @return {void}
     */
    _defineProperty(this, "errorCallback", (error, code) => {
      /* eslint-disable no-console */
      console.error(error);
      /* eslint-enable no-console */

      /* eslint-disable react/prop-types */
      this.props.onError(error, code, {
        error
      });
      /* eslint-enable react/prop-types */
    });
    /**
     * File fetch success callback that sets the file and view
     * Only set file if there is data to show in the sidebar.
     * Skills sidebar doesn't show when there is no data.
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    _defineProperty(this, "fetchMetadataSuccessCallback", ({
      editors
    }) => {
      this.setState({
        metadataEditors: editors
      });
    });
    /**
     * File fetch success callback that sets the file and sidebar visibility.
     * Also makes an optional request to fetch metadata editors
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    _defineProperty(this, "fetchFileSuccessCallback", file => {
      const {
        onFetchFileSuccess
      } = this.props;
      !!onFetchFileSuccess && onFetchFileSuccess();
      this.setState({
        file,
        isLoading: false
      }, this.fetchMetadata);
    });
    const {
      apiHost,
      cache,
      clientName,
      language,
      requestInterceptor,
      responseInterceptor,
      sharedLink,
      sharedLinkPassword,
      token
    } = props;
    this.api = new API({
      apiHost,
      cache,
      clientName,
      language,
      requestInterceptor,
      responseInterceptor,
      sharedLink,
      sharedLinkPassword,
      token,
      version: CLIENT_VERSION
    });

    /* eslint-disable react/prop-types */
    const {
      logger
    } = props;
    logger.onReadyMetric({
      endMarkName: MARK_NAME_JS_READY
    });
    /* eslint-enable react/prop-types */
  }

  /**
   * Destroys api instances with caches
   *
   * @private
   * @return {void}
   */
  clearCache() {
    this.api.destroy(true);
  }

  /**
   * Cleanup
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentWillUnmount() {
    // Don't destroy the cache while unmounting
    this.api.destroy(false);
  }

  /**
   * Fetches the file data on load
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidMount() {
    this.fetchFile();
  }

  /**
   * Fetches new file data on update
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    const {
      fileId
    } = this.props;
    const {
      fileId: prevFileId
    } = prevProps;
    if (fileId !== prevFileId) {
      this.fetchFile();
    }
  }
  /**
   * Fetches file metadata editors if required
   *
   * @private
   * @return {void}
   */
  fetchMetadata() {
    const {
      file
    } = this.state;
    const {
      metadataSidebarProps
    } = this.props;
    const {
      isFeatureEnabled = true
    } = metadataSidebarProps;

    // Only fetch metadata if we think that the file may have metadata on it
    // but currently the metadata feature is turned off. Use case of this would be a free
    // user who doesn't have the metadata feature but is collabed on a file from a user
    // who added metadata on the file. If the feature is enabled we always end up showing
    // the metadata sidebar irrespective of there being any existing metadata or not.
    const canHaveMetadataSidebar = !isFeatureEnabled && SidebarUtils.canHaveMetadataSidebar(this.props);
    if (canHaveMetadataSidebar) {
      this.api.getMetadataAPI(false).getMetadata(file, this.fetchMetadataSuccessCallback, noop, isFeatureEnabled);
    }
  }
  /**
   * Fetches a file
   *
   * @private
   * @param {Object|void} [fetchOptions] - Fetch options
   * @return {void}
   */
  fetchFile(fetchOptions = {}) {
    const {
      fileId,
      features
    } = this.props;
    const archiveEnabled = isFeatureEnabledInContext(features, 'contentSidebar.archive.enabled');
    const fields = archiveEnabled ? SIDEBAR_FIELDS_TO_FETCH_ARCHIVE : SIDEBAR_FIELDS_TO_FETCH;
    this.setState({
      isLoading: true
    });
    if (fileId && SidebarUtils.canHaveSidebar(this.props)) {
      this.api.getFileAPI().getFile(fileId, this.fetchFileSuccessCallback, this.errorCallback, _objectSpread(_objectSpread({}, fetchOptions), {}, {
        fields
      }));
    }
  }

  /**
   * Refreshes the sidebar panel
   * @returns {void}
   */
  refresh() {
    if (this.sidebarRef) {
      this.sidebarRef.refresh();
    }
  }

  /**
   * Renders the sidebar
   *
   * @private
   * @inheritdoc
   * @return {Element}
   */
  render() {
    const {
      activitySidebarProps,
      additionalTabs,
      boxAISidebarProps,
      className,
      currentUser,
      defaultView,
      detailsSidebarProps,
      docGenSidebarProps,
      features,
      fileId,
      getPreview,
      getViewer,
      hasAdditionalTabs,
      hasActivityFeed,
      hasMetadata,
      hasNav,
      hasSkills,
      hasVersions,
      history,
      isDefaultOpen,
      language,
      messages,
      metadataSidebarProps,
      onAnnotationSelect,
      onOpenChange,
      onPanelChange,
      onVersionChange,
      onVersionHistoryClick,
      signSidebarProps,
      theme,
      versionsSidebarProps
    } = this.props;
    const {
      file,
      isLoading,
      metadataEditors
    } = this.state;
    const initialPath = defaultView.charAt(0) === '/' ? defaultView : `/${defaultView}`;
    if (!file || !fileId || !SidebarUtils.shouldRenderSidebar(this.props, file, metadataEditors)) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: messages
    }, /*#__PURE__*/React.createElement(APIContext.Provider, {
      value: this.api
    }, /*#__PURE__*/React.createElement(NavRouter, {
      history: history,
      initialEntries: [initialPath],
      features: features
    }, /*#__PURE__*/React.createElement(TooltipProvider, null, /*#__PURE__*/React.createElement(Sidebar, {
      activitySidebarProps: activitySidebarProps,
      additionalTabs: additionalTabs,
      boxAISidebarProps: boxAISidebarProps,
      className: className,
      currentUser: currentUser,
      detailsSidebarProps: detailsSidebarProps,
      docGenSidebarProps: docGenSidebarProps,
      file: file,
      fileId: fileId,
      getPreview: getPreview,
      getViewer: getViewer,
      hasActivityFeed: hasActivityFeed,
      hasAdditionalTabs: hasAdditionalTabs,
      hasNav: hasNav,
      hasMetadata: hasMetadata,
      hasSkills: hasSkills,
      hasVersions: hasVersions,
      isDefaultOpen: isDefaultOpen,
      isLoading: isLoading,
      metadataEditors: metadataEditors,
      metadataSidebarProps: metadataSidebarProps,
      onAnnotationSelect: onAnnotationSelect,
      onOpenChange: onOpenChange,
      onPanelChange: onPanelChange,
      onVersionChange: onVersionChange,
      onVersionHistoryClick: onVersionHistoryClick,
      signSidebarProps: signSidebarProps,
      theme: theme,
      versionsSidebarProps: versionsSidebarProps,
      wrappedComponentRef: ref => {
        this.sidebarRef = ref;
      }
    })))));
  }
}
_defineProperty(ContentSidebar, "defaultProps", {
  activitySidebarProps: {},
  apiHost: DEFAULT_HOSTNAME_API,
  boxAISidebarProps: {},
  className: '',
  clientName: CLIENT_NAME_CONTENT_SIDEBAR,
  defaultView: '',
  detailsSidebarProps: {},
  docGenSidebarProps: {
    enabled: false
  },
  getPreview: noop,
  getViewer: noop,
  hasActivityFeed: false,
  hasAdditionalTabs: false,
  hasMetadata: false,
  hasNav: true,
  hasSkills: false,
  isDefaultOpen: true,
  metadataSidebarProps: {}
});
export { ContentSidebar as ContentSidebarComponent };
export default flow([withFeatureConsumer, withFeatureProvider, withBlueprintModernization, withLogger(ORIGIN_CONTENT_SIDEBAR), withErrorBoundary(ORIGIN_CONTENT_SIDEBAR)])(ContentSidebar);
//# sourceMappingURL=ContentSidebar.js.map