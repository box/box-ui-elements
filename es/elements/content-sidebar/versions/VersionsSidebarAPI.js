function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Versions Sidebar API Helper
 * @author Box
 */
import API from '../../../api';
import { FILE_VERSION_FIELDS_TO_FETCH, FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE } from '../../../utils/fields';
export default class VersionsSidebarAPI {
  constructor({
    api,
    fileId,
    isArchiveFeatureEnabled
  }) {
    _defineProperty(this, "fetchData", () => {
      return Promise.all([this.fetchFile(), this.fetchVersions()]).then(this.fetchVersionCurrent);
    });
    _defineProperty(this, "fetchDownloadUrl", version => {
      return new Promise((resolve, reject) => {
        if (!version) {
          return reject(new Error('Could not find requested version'));
        }
        return this.api.getFileAPI().getDownloadUrl(this.fileId, version, resolve, reject);
      });
    });
    _defineProperty(this, "fetchFile", () => {
      const fields = this.isArchiveFeatureEnabled ? FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE : FILE_VERSION_FIELDS_TO_FETCH;
      return new Promise((resolve, reject) => this.api.getFileAPI().getFile(this.fileId, resolve, reject, {
        fields,
        forceFetch: true
      }));
    });
    _defineProperty(this, "fetchVersions", () => {
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).getVersions(this.fileId, resolve, reject));
    });
    _defineProperty(this, "fetchVersionCurrent", ([fileResponse, versionsResponse]) => {
      const {
        file_version = {}
      } = fileResponse;
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).getVersion(this.fileId, file_version.id, currentVersionResponse => {
        resolve([fileResponse, this.api.getVersionsAPI(false).addCurrentVersion(currentVersionResponse, versionsResponse, fileResponse)]);
      }, reject));
    });
    _defineProperty(this, "fetchVersion", versionId => {
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).getVersion(this.fileId, versionId, resolve, reject));
    });
    _defineProperty(this, "deleteVersion", version => {
      const {
        id: versionId,
        permissions = {}
      } = version || {};
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).deleteVersion({
        fileId: this.fileId,
        permissions,
        successCallback: resolve,
        errorCallback: reject,
        versionId
      }));
    });
    _defineProperty(this, "promoteVersion", version => {
      const {
        id: versionId,
        permissions = {}
      } = version || {};
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).promoteVersion({
        fileId: this.fileId,
        permissions,
        successCallback: resolve,
        errorCallback: reject,
        versionId
      }));
    });
    _defineProperty(this, "restoreVersion", version => {
      const {
        id: versionId,
        permissions = {}
      } = version || {};
      return new Promise((resolve, reject) => this.api.getVersionsAPI(false).restoreVersion({
        fileId: this.fileId,
        permissions,
        successCallback: resolve,
        errorCallback: reject,
        versionId
      }));
    });
    this.api = api;
    this.fileId = fileId;
    this.isArchiveFeatureEnabled = isArchiveFeatureEnabled;
  }
}
//# sourceMappingURL=VersionsSidebarAPI.js.map