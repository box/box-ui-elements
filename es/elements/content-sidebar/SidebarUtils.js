function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Utility for sidebar
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import AsyncLoad from '../common/async-load';
import messages from '../common/messages';
import SidebarLoading from './SidebarLoading';
import SidebarLoadingError from './SidebarLoadingError';
import { hasSkills as hasSkillsData } from './skills/skillUtils';
import { mark } from '../../utils/performance';
import { SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_METADATA, SIDEBAR_VIEW_DETAILS, SIDEBAR_VIEW_VERSIONS, SIDEBAR_VIEW_DOCGEN, SIDEBAR_VIEW_METADATA_REDESIGN, SIDEBAR_VIEW_BOXAI } from '../../constants';
import { isFeatureEnabled } from '../common/feature-checking';
class SidebarUtils {
  /**
   * Determines if we can render the details sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should render
   */
  static canHaveDetailsSidebar({
    detailsSidebarProps = {}
  }) {
    const {
      hasProperties,
      hasAccessStats,
      hasClassification,
      hasVersions,
      hasNotices
    } = detailsSidebarProps;
    return !!hasProperties || !!hasAccessStats || !!hasClassification || !!hasVersions || !!hasNotices;
  }

  /**
   * Determines if we can render the metadata sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should render
   */
  static canHaveMetadataSidebar(props) {
    return !!props.hasMetadata;
  }

  /**
   * Determines if we can render the Box AI sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should render
   */
  static canHaveBoxAISidebar(props) {
    return isFeatureEnabled(props.features, 'boxai.sidebar.enabled');
  }

  /**
   * Determines if we can render the activity sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should render
   */
  static canHaveActivitySidebar(props) {
    return !!props.hasActivityFeed;
  }

  /**
   * Determines if we can render the skills sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should render
   */
  static canHaveSkillsSidebar(props) {
    return !!props.hasSkills;
  }

  /**
   * Determines if we can render the sidebar.
   * Only relies on props.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @return {Boolean} true if we should have a sidebar
   */
  static canHaveSidebar(props) {
    return SidebarUtils.canHaveDetailsSidebar(props) || SidebarUtils.canHaveActivitySidebar(props) || SidebarUtils.canHaveBoxAISidebar(props) || SidebarUtils.canHaveSkillsSidebar(props) || SidebarUtils.canHaveMetadataSidebar(props);
  }

  /**
   * Determines if we should bother rendering the skills sidebar.
   * Relies on props and file data.
   *
   * @private
   * @param {ContentSidebarProps} props - User passed in props
   * @param {BoxItem} file - box file
   * @return {Boolean} true if we should render
   */
  static shouldRenderSkillsSidebar(props, file) {
    return !!file && SidebarUtils.canHaveSkillsSidebar(props) && hasSkillsData(file);
  }

  /**
   * Determines if we should bother rendering the metadata sidebar.
   * Relies on props and metadata data and feature enabled or not.
   *
   * @private
   * @param {ContentSidebarProps} props - User passed in props
   * @param {Array<MetadataEditor>} editors - metadata editors
   * @return {Boolean} true if we should render
   */
  static shouldRenderMetadataSidebar(props, editors) {
    const {
      metadataSidebarProps = {}
    } = props;
    const {
      isFeatureEnabled: isFeatureEnabledMetadataSidebarProp = true
    } = metadataSidebarProps;
    return SidebarUtils.canHaveMetadataSidebar(props) && (isFeatureEnabledMetadataSidebarProp || Array.isArray(editors) && editors.length > 0);
  }

  /**
   * Determines if we should bother rendering the sidebar.
   * Relies on props and file data.
   *
   * @param {ContentSidebarProps} props - User passed in props
   * @param {BoxItem} file - box file
   * @param {Array<MetadataEditor>} editors - metadata editors
   * @return {Boolean} true if we should fetch or render
   */
  static shouldRenderSidebar(props, file, editors) {
    return !!file && (SidebarUtils.canHaveDetailsSidebar(props) || SidebarUtils.shouldRenderSkillsSidebar(props, file) || SidebarUtils.canHaveActivitySidebar(props) || SidebarUtils.canHaveBoxAISidebar(props) || SidebarUtils.shouldRenderMetadataSidebar(props, editors));
  }

  /**
   * Gets the title for a given sidebar view
   *
   * @param {string} view - the view name
   * @return {React.Node} - the node to render
   */
  static getTitleForView(view) {
    switch (view) {
      case SIDEBAR_VIEW_SKILLS:
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarSkillsTitle);
      case SIDEBAR_VIEW_DETAILS:
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarDetailsTitle);
      case SIDEBAR_VIEW_METADATA:
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarMetadataTitle);
      case SIDEBAR_VIEW_BOXAI:
        // Box AI Sidebar title is not displayed in the BoxAISidebar component,
        // and it also should not be visible as fallback before panel is loaded
        // as that results in title flickering. So, returning empty string here.
        return '';
      case SIDEBAR_VIEW_ACTIVITY:
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarActivityTitle);
      case SIDEBAR_VIEW_DOCGEN:
        return /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarDocGenTitle);
      default:
        return null;
    }
  }

  /**
   * Marks and gets the loader for a given sidebar view
   *
   * @param {String} view - the view name
   * @param {String} markName -  the name to be used by performance.mark
   * @return {Function} - a function which will resolve the module to load
   */
  static getLoaderForView(view, markName) {
    mark(markName);
    let importFn;
    switch (view) {
      case SIDEBAR_VIEW_SKILLS:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "skills-sidebar" */'./SkillsSidebar');
        break;
      case SIDEBAR_VIEW_DETAILS:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "details-sidebar" */'./DetailsSidebar');
        break;
      case SIDEBAR_VIEW_METADATA:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "metadata-sidebar" */'./MetadataSidebar');
        break;
      case SIDEBAR_VIEW_METADATA_REDESIGN:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "metadata-sidebar-redesigned" */'./MetadataSidebarRedesign');
        break;
      case SIDEBAR_VIEW_ACTIVITY:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "activity-sidebar" */'./ActivitySidebar');
        break;
      case SIDEBAR_VIEW_BOXAI:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "boxai-sidebar" */'./BoxAISidebar');
        break;
      case SIDEBAR_VIEW_VERSIONS:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "versions-sidebar" */'./versions');
        break;
      case SIDEBAR_VIEW_DOCGEN:
        importFn = import(/* webpackMode: "lazy", webpackChunkName: "docgen-sidebar" */'./DocGenSidebar/DocGenSidebar');
        break;
      default:
        return Promise.resolve(null);
    }
    return importFn;
  }

  /**
   * Gets the component which async loads a given sidebar view
   *
   * @param {String} view - the view name
   * @param {String} markName -  the name to be used by performance.mark
   * @param {Object} props - additional props
   * @return {React.Node} - the node to render
   */
  static getAsyncSidebarContent(view, markName, props = {}) {
    return AsyncLoad(_objectSpread({
      errorComponent: SidebarLoadingError,
      fallback: /*#__PURE__*/React.createElement(SidebarLoading, {
        title: this.getTitleForView(view)
      }),
      loader: () => this.getLoaderForView(view, markName)
    }, props));
  }
}
export default SidebarUtils;
//# sourceMappingURL=SidebarUtils.js.map