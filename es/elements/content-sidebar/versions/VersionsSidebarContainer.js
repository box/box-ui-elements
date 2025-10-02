function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Versions Sidebar container
 * @author Box
 */

import * as React from 'react';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import { generatePath } from 'react-router-dom';
import { withFeatureConsumer, isFeatureEnabled } from '../../common/feature-checking';
import API from '../../../api';
import { FIELD_METADATA_ARCHIVE } from '../../../constants';
import messages from './messages';
import openUrlInsideIframe from '../../../utils/iframe';
import StaticVersionsSidebar from './StaticVersionSidebar';
import VersionsSidebar from './VersionsSidebar';
import VersionsSidebarAPI from './VersionsSidebarAPI';
import { withAPIContext } from '../../common/api-context';
import { withRouterIfEnabled } from '../../common/routing';
import { ViewType } from '../../common/types/SidebarNavigation';
class VersionsSidebarContainer extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isArchived: false,
      isLoading: true,
      isWatermarked: false,
      versionCount: Infinity,
      versionLimit: Infinity,
      versions: []
    });
    _defineProperty(this, "window", window);
    _defineProperty(this, "handleActionDelete", versionId => {
      this.setState({
        isLoading: true
      });
      return this.api.deleteVersion(this.findVersion(versionId)).then(() => this.api.fetchVersion(versionId)).then(this.handleDeleteSuccess).then(() => this.props.onVersionDelete(versionId)).catch(() => this.handleActionError(messages.versionActionDeleteError));
    });
    _defineProperty(this, "handleActionDownload", versionId => {
      return this.api.fetchDownloadUrl(this.findVersion(versionId)).then(openUrlInsideIframe).then(() => this.props.onVersionDownload(versionId)).catch(() => this.handleActionError(messages.versionActionDownloadError));
    });
    _defineProperty(this, "handleActionPreview", versionId => {
      this.updateVersion(versionId);
      this.props.onVersionPreview(versionId);
    });
    _defineProperty(this, "handleActionPromote", versionId => {
      this.setState({
        isLoading: true
      });
      return this.api.promoteVersion(this.findVersion(versionId)).then(this.api.fetchData).then(this.handleFetchSuccess).then(this.handlePromoteSuccess).then(() => this.props.onVersionPromote(versionId)).catch(() => this.handleActionError(messages.versionActionPromoteError));
    });
    _defineProperty(this, "handleActionRestore", versionId => {
      this.setState({
        isLoading: true
      });
      return this.api.restoreVersion(this.findVersion(versionId)).then(() => this.api.fetchVersion(versionId)).then(this.handleRestoreSuccess).then(() => this.props.onVersionRestore(versionId)).catch(() => this.handleActionError(messages.versionActionRestoreError));
    });
    _defineProperty(this, "handleActionError", message => {
      this.setState({
        error: message,
        isLoading: false
      });
    });
    _defineProperty(this, "handleDeleteSuccess", data => {
      const {
        versionId: selectedVersionId
      } = this.props;
      const {
        id: versionId
      } = data;
      this.mergeResponse(data);

      // Bump the user to the current version if they deleted their selected version
      if (versionId === selectedVersionId) {
        this.updateVersionToCurrent();
      }
    });
    _defineProperty(this, "handleRestoreSuccess", data => {
      this.mergeResponse(data);
    });
    _defineProperty(this, "handleFetchError", () => {
      this.setState({
        error: messages.versionFetchError,
        isArchived: false,
        isLoading: false,
        isWatermarked: false,
        versionCount: 0,
        versions: []
      });
    });
    _defineProperty(this, "handleFetchSuccess", ([fileResponse, versionsResponse]) => {
      const {
        api
      } = this.props;
      const {
        version_limit
      } = fileResponse;
      const isArchived = !!getProp(fileResponse, FIELD_METADATA_ARCHIVE);
      const isWatermarked = getProp(fileResponse, 'watermark_info.is_watermarked', false);
      const versionLimit = version_limit !== null && version_limit !== undefined ? version_limit : Infinity;
      const versionsWithPermissions = api.getVersionsAPI(false).addPermissions(versionsResponse, fileResponse) || {};
      const {
        entries: versions,
        total_count: versionCount
      } = versionsWithPermissions;
      this.setState({
        error: undefined,
        isArchived,
        isLoading: false,
        isWatermarked,
        versionCount,
        versionLimit,
        versions: this.sortVersions(versions)
      }, this.verifyVersion);
      return [fileResponse, versionsResponse];
    });
    _defineProperty(this, "handlePromoteSuccess", ([file]) => {
      const {
        file_version: fileVersion
      } = file;
      if (fileVersion) {
        this.updateVersion(fileVersion.id);
      }
    });
    _defineProperty(this, "initialize", () => {
      const {
        api,
        features,
        fileId
      } = this.props;
      const isArchiveFeatureEnabled = isFeatureEnabled(features, 'contentSidebar.archive.enabled');
      this.api = new VersionsSidebarAPI({
        api,
        fileId,
        isArchiveFeatureEnabled
      });
    });
    _defineProperty(this, "fetchData", () => {
      return this.api.fetchData().then(this.handleFetchSuccess).catch(this.handleFetchError);
    });
    _defineProperty(this, "findVersion", versionId => {
      const {
        versions
      } = this.state;
      return versions.find(version => version.id === versionId);
    });
    _defineProperty(this, "getCurrentVersionId", () => {
      const {
        versions
      } = this.state;
      return versions[0] ? versions[0].id : null;
    });
    _defineProperty(this, "mergeVersions", newVersion => {
      const {
        versions
      } = this.state;
      const newVersionId = newVersion ? newVersion.id : '';
      return versions.map(version => version.id === newVersionId ? merge(_objectSpread({}, version), newVersion) : version);
    });
    _defineProperty(this, "mergeResponse", data => {
      const newVersions = this.mergeVersions(data);
      this.setState({
        error: undefined,
        isLoading: false,
        versions: newVersions
      });
    });
    _defineProperty(this, "updateVersion", versionId => {
      const {
        history,
        match,
        routerDisabled,
        internalSidebarNavigationHandler,
        internalSidebarNavigation
      } = this.props;
      if (routerDisabled && internalSidebarNavigationHandler) {
        const navigationUpdate = _objectSpread({}, internalSidebarNavigation);
        if (versionId) {
          navigationUpdate.versionId = versionId;
        } else {
          delete navigationUpdate.versionId;
        }
        internalSidebarNavigationHandler(navigationUpdate);
      } else if (history) {
        history.push(generatePath(match.path, _objectSpread(_objectSpread({}, match.params), {}, {
          versionId
        })));
      }
    });
    _defineProperty(this, "updateVersionToCurrent", () => {
      this.updateVersion(this.getCurrentVersionId());
    });
    _defineProperty(this, "verifyVersion", () => {
      const {
        onVersionChange,
        versionId
      } = this.props;
      const selectedVersion = this.findVersion(versionId);
      if (selectedVersion) {
        onVersionChange(selectedVersion, {
          currentVersionId: this.getCurrentVersionId(),
          updateVersionToCurrent: this.updateVersionToCurrent
        });
      } else {
        this.updateVersionToCurrent();
      }
    });
  }
  componentDidMount() {
    const {
      onLoad
    } = this.props;
    this.initialize();
    this.fetchData().then(() => {
      onLoad({
        component: 'preview',
        feature: 'versions'
      });
    });
  }
  componentDidUpdate({
    fileId: prevFileId,
    versionId: prevVersionId
  }) {
    const {
      fileId,
      versionId
    } = this.props;
    if (fileId !== prevFileId) {
      this.refresh();
    }
    if (versionId !== prevVersionId) {
      this.verifyVersion();
    }
  }
  refresh() {
    this.initialize();
    this.setState({
      isLoading: true
    }, this.fetchData);
  }
  sortVersions(versions = []) {
    return [...versions].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }
  render() {
    const {
      fileId,
      parentName,
      onUpgradeClick,
      routerDisabled,
      internalSidebarNavigation,
      internalSidebarNavigationHandler
    } = this.props;
    if (onUpgradeClick) {
      return /*#__PURE__*/React.createElement(StaticVersionsSidebar, _extends({
        onUpgradeClick: onUpgradeClick,
        parentName: parentName,
        routerDisabled: routerDisabled,
        internalSidebarNavigation: internalSidebarNavigation,
        internalSidebarNavigationHandler: internalSidebarNavigationHandler
      }, this.state));
    }
    return /*#__PURE__*/React.createElement(VersionsSidebar, _extends({
      fileId: fileId,
      internalSidebarNavigation: internalSidebarNavigation,
      internalSidebarNavigationHandler: internalSidebarNavigationHandler,
      onDelete: this.handleActionDelete,
      onDownload: this.handleActionDownload,
      onPreview: this.handleActionPreview,
      onPromote: this.handleActionPromote,
      onRestore: this.handleActionRestore,
      parentName: parentName,
      routerDisabled: routerDisabled
    }, this.state));
  }
}
_defineProperty(VersionsSidebarContainer, "defaultProps", {
  onLoad: noop,
  onVersionChange: noop,
  onVersionDelete: noop,
  onVersionDownload: noop,
  onVersionPreview: noop,
  onVersionPromote: noop,
  onVersionRestore: noop,
  parentName: ViewType.DETAILS
});
export { VersionsSidebarContainer as VersionsSidebarContainerComponent };
export default flow([withRouterIfEnabled, withAPIContext, withFeatureConsumer])(VersionsSidebarContainer);
//# sourceMappingURL=VersionsSidebarContainer.js.map