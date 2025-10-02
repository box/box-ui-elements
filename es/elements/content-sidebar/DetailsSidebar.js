function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Details sidebar component
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import API from '../../api';
import messages from '../common/messages';
import SidebarAccessStats from './SidebarAccessStats';
import SidebarClassification from './SidebarClassification';
// $FlowFixMe typescript component
import SidebarContentInsights from './SidebarContentInsights';
import SidebarContent from './SidebarContent';
import SidebarFileProperties from './SidebarFileProperties';
import SidebarNotices from './SidebarNotices';
import SidebarSection from './SidebarSection';
import SidebarVersions from './SidebarVersions';
import { EVENT_JS_READY } from '../common/logger/constants';
import { getBadItemError } from '../../utils/error';
import { isFeatureEnabled, withFeatureConsumer } from '../common/feature-checking';
import { mark } from '../../utils/performance';
import { SECTION_TARGETS } from '../common/interactionTargets';
import { SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE } from '../../utils/fields';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { HTTP_STATUS_CODE_FORBIDDEN, ORIGIN_DETAILS_SIDEBAR, IS_ERROR_DISPLAYED, SIDEBAR_VIEW_DETAILS } from '../../constants';
import './DetailsSidebar.scss';
const MARK_NAME_JS_READY = `${ORIGIN_DETAILS_SIDEBAR}_${EVENT_JS_READY}`;
mark(MARK_NAME_JS_READY);
class DetailsSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    /**
     * File description update callback
     *
     * @private
     * @param {BoxItem} file - Updated file object
     * @return {void}
     */
    _defineProperty(this, "descriptionChangeSuccessCallback", file => {
      this.setState({
        file,
        fileError: undefined
      });
    });
    /**
     * Handles a successful file fetch
     *
     * @param {Object} file - the box file
     * @return {void}
     */
    _defineProperty(this, "fetchFileSuccessCallback", file => {
      this.setState({
        file,
        fileError: undefined
      });
    });
    /**
     * Handles a failed file fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    _defineProperty(this, "fetchFileErrorCallback", (e, code) => {
      // TODO: handle the error properly (probably with maskError) once files call split out
      this.setState({
        file: undefined
      });
      this.props.onError(e, code, {
        e
      });
    });
    /**
     * Handles a failed file description update
     *
     * @private
     * @param {BoxItem} file - Original file object
     * @return {void}
     */
    _defineProperty(this, "descriptionChangeErrorCallback", file => {
      // Reset the state back to the original description since the API call failed
      this.setState({
        file,
        fileError: {
          inlineError: {
            title: messages.fileDescriptionInlineErrorTitleMessage,
            content: messages.defaultInlineErrorContentMessage
          }
        }
      });
    });
    /**
     * Function to update file description
     *
     * @private
     * @param {string} newDescription - New file description
     * @return {void}
     */
    _defineProperty(this, "onDescriptionChange", newDescription => {
      const {
        api
      } = this.props;
      const {
        file
      } = this.state;
      if (!file) {
        throw getBadItemError();
      }
      const {
        description
      } = file;
      if (newDescription === description) {
        return;
      }
      api.getFileAPI().setFileDescription(file, newDescription, this.descriptionChangeSuccessCallback, this.descriptionChangeErrorCallback);
    });
    /**
     * Handles a failed file access stats fetch
     *
     * @private
     * @param {Error} e - API error
     * @param {string} code - error code
     * @return {void}
     */
    _defineProperty(this, "fetchAccessStatsErrorCallback", (e, code) => {
      if (!this.props.hasAccessStats) {
        return;
      }
      const isForbidden = getProp(e, 'status') === HTTP_STATUS_CODE_FORBIDDEN;
      let accessStatsError;
      if (isForbidden) {
        accessStatsError = {
          error: messages.fileAccessStatsPermissionsError
        };
      } else {
        accessStatsError = {
          maskError: {
            errorHeader: messages.fileAccessStatsErrorHeaderMessage,
            errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
          }
        };
      }
      this.setState({
        isLoadingAccessStats: false,
        accessStats: undefined,
        accessStatsError
      });
      this.props.onError(e, code, {
        e,
        [IS_ERROR_DISPLAYED]: !isForbidden
      });
    });
    /**
     * File access stats fetch success callback
     *
     * @private
     * @param {Object} accessStats - access stats for a file
     * @return {void}
     */
    _defineProperty(this, "fetchAccessStatsSuccessCallback", accessStats => {
      if (!this.props.hasAccessStats) {
        return;
      }
      this.setState({
        accessStats,
        accessStatsError: undefined,
        isLoadingAccessStats: false
      });
    });
    this.state = {
      isLoadingAccessStats: false
    };
    const {
      logger
    } = this.props;
    logger.onReadyMetric({
      endMarkName: MARK_NAME_JS_READY
    });
  }
  componentDidMount() {
    const {
      hasAccessStats,
      hasContentInsights,
      fetchContentInsights
    } = this.props;
    this.fetchFile();
    if (hasAccessStats) {
      this.fetchAccessStats();
    }
    if (hasContentInsights && fetchContentInsights) {
      fetchContentInsights();
    }
  }
  componentDidUpdate({
    hasAccessStats: prevHasAccessStats,
    hasContentInsights: prevHasContentInsights
  }) {
    const {
      hasAccessStats,
      hasContentInsights,
      fetchContentInsights
    } = this.props;
    // Component visibility props such as hasAccessStats can sometimes be flipped after an async call
    const hasAccessStatsChanged = prevHasAccessStats !== hasAccessStats;
    const hasContentInsightsChanged = prevHasContentInsights !== hasContentInsights;
    if (hasAccessStatsChanged) {
      if (hasAccessStats) {
        this.fetchAccessStats();
      } else {
        this.setState({
          isLoadingAccessStats: false,
          accessStats: undefined,
          accessStatsError: undefined
        });
      }
    }
    if (hasContentInsightsChanged && hasContentInsights && fetchContentInsights) {
      fetchContentInsights();
    }
  }
  /**
   * Fetches a file with the fields needed for details sidebar
   *
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @return {void}
   */
  fetchFile(successCallback = this.fetchFileSuccessCallback, errorCallback = this.fetchFileErrorCallback) {
    const {
      api,
      features,
      fileId
    } = this.props;
    const archiveEnabled = isFeatureEnabled(features, 'contentSidebar.archive.enabled');

    // TODO: replace this with DETAILS_SIDEBAR_FIELDS_TO_FETCH as we do not need all the sidebar fields
    const fields = archiveEnabled ? SIDEBAR_FIELDS_TO_FETCH_ARCHIVE : SIDEBAR_FIELDS_TO_FETCH;
    api.getFileAPI().getFile(fileId, successCallback, errorCallback, {
      fields
    });
  }
  /**
   * Fetches the access stats for a file
   *
   * @private
   * @return {void}
   */
  fetchAccessStats() {
    const {
      api,
      fileId
    } = this.props;
    const {
      isLoadingAccessStats
    } = this.state;
    if (isLoadingAccessStats) {
      return;
    }
    this.setState({
      isLoadingAccessStats: true
    });
    api.getFileAccessStatsAPI(false).getFileAccessStats(fileId, this.fetchAccessStatsSuccessCallback, this.fetchAccessStatsErrorCallback);
  }
  refresh() {
    this.fetchAccessStats();
  }
  render() {
    const {
      classification,
      contentInsights,
      elementId,
      hasProperties,
      hasNotices,
      hasAccessStats,
      hasClassification,
      hasContentInsights,
      hasRetentionPolicy,
      hasVersions,
      onAccessStatsClick,
      onVersionHistoryClick,
      onClassificationClick,
      onContentInsightsClick,
      onRetentionPolicyExtendClick,
      retentionPolicy
    } = this.props;
    const {
      accessStats,
      accessStatsError,
      file,
      fileError,
      isLoadingAccessStats
    } = this.state;

    // TODO: Add loading indicator and handle errors once file call is split out
    return /*#__PURE__*/React.createElement(SidebarContent, {
      className: "bcs-details",
      elementId: elementId,
      sidebarView: SIDEBAR_VIEW_DETAILS,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarDetailsTitle)
    }, file && hasNotices && /*#__PURE__*/React.createElement("div", {
      className: "bcs-DetailsSidebar-notices"
    }, /*#__PURE__*/React.createElement(SidebarNotices, {
      file: file
    })), file && hasClassification && /*#__PURE__*/React.createElement(SidebarClassification, {
      classification: classification,
      file: file,
      onEdit: onClassificationClick
    }), file && hasAccessStats && /*#__PURE__*/React.createElement(SidebarAccessStats, _extends({
      accessStats: accessStats,
      file: file,
      onAccessStatsClick: onAccessStatsClick
    }, accessStatsError)), file && hasContentInsights && /*#__PURE__*/React.createElement(SidebarContentInsights, {
      contentInsights: contentInsights,
      onContentInsightsClick: onContentInsightsClick
    }), file && hasProperties && /*#__PURE__*/React.createElement(SidebarSection, {
      interactionTarget: SECTION_TARGETS.FILE_PROPERTIES,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarProperties)
    }, hasVersions && /*#__PURE__*/React.createElement(SidebarVersions, {
      file: file,
      onVersionHistoryClick: onVersionHistoryClick
    }), /*#__PURE__*/React.createElement(SidebarFileProperties, _extends({
      file: file,
      onDescriptionChange: this.onDescriptionChange
    }, fileError, {
      hasRetentionPolicy: hasRetentionPolicy,
      isLoading: isLoadingAccessStats,
      onRetentionPolicyExtendClick: onRetentionPolicyExtendClick,
      retentionPolicy: retentionPolicy
    }))));
  }
}
_defineProperty(DetailsSidebar, "defaultProps", {
  hasNotices: false,
  hasProperties: false,
  hasAccessStats: false,
  hasClassification: false,
  hasRetentionPolicy: false,
  hasVersions: false,
  onError: noop
});
export { DetailsSidebar as DetailsSidebarComponent };
export default flow([withLogger(ORIGIN_DETAILS_SIDEBAR), withErrorBoundary(ORIGIN_DETAILS_SIDEBAR), withAPIContext, withFeatureConsumer])(DetailsSidebar);
//# sourceMappingURL=DetailsSidebar.js.map