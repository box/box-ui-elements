const _excluded = ["permissions"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box versions API
 * @author Box
 */

import getProp from 'lodash/get';
import { FILE_VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import { DEFAULT_FETCH_END, DEFAULT_FETCH_START, ERROR_CODE_DELETE_VERSION, ERROR_CODE_FETCH_VERSION, ERROR_CODE_FETCH_VERSIONS, ERROR_CODE_PROMOTE_VERSION, ERROR_CODE_RESTORE_VERSION, PERMISSION_CAN_DELETE, PERMISSION_CAN_UPLOAD } from '../constants';
class Versions extends OffsetBasedAPI {
  constructor(...args) {
    super(...args);
    /**
     * Returns the versions api response data
     * @param {Object} data the api response data
     */
    _defineProperty(this, "successHandler", data => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }
      this.successCallback(data);
    });
  }
  /**
   * API URL for file versions
   *
   * @param {string} id - a box file id
   * @return {string} base url for file versions
   */
  getUrl(id) {
    if (!id) {
      throw new Error('Missing file id!');
    }
    return `${this.getBaseApiUrl()}/files/${id}/versions`;
  }

  /**
   * API URL for version info endpoint
   *
   * @param {string} id - a box file id
   * @param {string} versionId - a box file version id
   * @return {string} url for version info
   */
  getVersionUrl(id, versionId) {
    if (!versionId) {
      throw new Error('Missing version id!');
    }
    return `${this.getUrl(id)}/${versionId}`;
  }
  /**
   * Helper to add associated permissions from the file to the version objects
   *
   * @param {FileVersions} versions - API returned file versions for this file
   * @param {BoxItem} file - The parent file object
   * @return {FileVersions} modified versions array including associated file permissions
   */
  addPermissions(versions, file) {
    if (!versions) {
      return versions;
    }

    // Versions defer to the parent file for upload (promote) permissions
    const {
      entries,
      total_count
    } = versions;
    const can_upload = getProp(file, ['permissions', PERMISSION_CAN_UPLOAD], false);
    return {
      entries: entries.map(_ref => {
        let {
            permissions
          } = _ref,
          version = _objectWithoutProperties(_ref, _excluded);
        return _objectSpread(_objectSpread({}, version), {}, {
          permissions: _objectSpread({
            can_upload
          }, permissions)
        });
      }),
      total_count
    };
  }

  /**
   * API for deleting a version of a file
   *
   * @param {Object} options - the request options
   * @param {string} options.fileId - a box file id
   * @param {string} options.versionId - a box file version id
   * @param {BoxItemVersionPermission} options.permissions - the permissions for the file
   * @param {Function} options.successCallback - the success callback
   * @param {Function} options.errorCallback - the error callback
   * @returns {void}
   */
  deleteVersion({
    errorCallback,
    fileId,
    permissions,
    successCallback,
    versionId
  }) {
    this.errorCode = ERROR_CODE_DELETE_VERSION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.delete({
      id: fileId,
      url: this.getVersionUrl(fileId, versionId),
      successCallback,
      errorCallback
    });
  }

  /**
   * API for fetching versions on a file
   *
   * @param {string} fileId - a box file id
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @param {number} offset - the offset of the starting version index
   * @param {number} limit - the max number of versions to fetch
   * @param {Array} fields - the fields to fetch
   * @param {boolean} shouldFetchAll - true if all versions should be fetched
   * @returns {void}
   */
  getVersions(fileId, successCallback, errorCallback, offset = DEFAULT_FETCH_START, limit = DEFAULT_FETCH_END, fields = FILE_VERSIONS_FIELDS_TO_FETCH, shouldFetchAll = true) {
    this.errorCode = ERROR_CODE_FETCH_VERSIONS;
    this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
  }

  /**
   * API for fetching a certain version for a file
   *
   * @param {string} fileId - a box file id
   * @param {string} fileVersionId - a box file version id
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @returns {void}
   */
  getVersion(fileId, fileVersionId, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_FETCH_VERSION;
    this.get({
      id: fileId,
      successCallback,
      errorCallback,
      url: this.getVersionUrl(fileId, fileVersionId),
      requestData: {
        params: {
          fields: FILE_VERSIONS_FIELDS_TO_FETCH.toString()
        }
      }
    });
  }

  /**
   * Decorates the current version and adds it to an existing FileVersions object
   *
   * @param {BoxItemVersion} currentVersion - a box version
   * @param {FileVersions} versions - versions response
   * @param {BoxItem} file - a box file
   * @returns {FileVersions} - a FileVersions object containing the decorated current version
   */
  addCurrentVersion(currentVersion, versions, file) {
    if (!currentVersion) {
      return versions || {
        entries: [],
        total_count: 0
      };
    }
    if (!versions) {
      return {
        entries: [currentVersion],
        total_count: 1
      };
    }
    const promotedFromId = getProp(file, 'restored_from.id');
    const promotedVersion = versions.entries.find(version => version.id === promotedFromId);
    if (promotedVersion) {
      currentVersion.version_promoted = promotedVersion.version_number;
    }
    return {
      entries: [...versions.entries, currentVersion],
      total_count: versions.total_count + 1
    };
  }

  /**
   * API for promoting a version of a file to current
   *
   * @param {Object} options - the request options
   * @param {string} options.fileId - a box file id
   * @param {string} options.versionId - a box file version id
   * @param {BoxItemVersionPermission} options.permissions - the permissions for the file
   * @param {Function} options.successCallback - the success callback
   * @param {Function} options.errorCallback - the error callback
   * @returns {void}
   */
  promoteVersion({
    errorCallback,
    fileId,
    permissions,
    successCallback,
    versionId
  }) {
    this.errorCode = ERROR_CODE_PROMOTE_VERSION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_UPLOAD, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.post({
      id: fileId,
      data: {
        data: {
          id: versionId,
          type: 'file_version'
        }
      },
      url: this.getVersionUrl(fileId, 'current'),
      successCallback,
      errorCallback
    });
  }

  /**
   * API for restoring a deleted version of a file
   *
   * @param {Object} options - the request options
   * @param {string} options.fileId - a box file id
   * @param {string} options.versionId - a box file version id
   * @param {BoxItemVersionPermission} options.permissions - the permissions for the file
   * @param {Function} options.successCallback - the success callback
   * @param {Function} options.errorCallback - the error callback
   * @returns {void}
   */
  restoreVersion({
    errorCallback,
    fileId,
    permissions,
    successCallback,
    versionId
  }) {
    this.errorCode = ERROR_CODE_RESTORE_VERSION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.put({
      id: fileId,
      data: {
        data: {
          trashed_at: null
        }
      },
      url: this.getVersionUrl(fileId, versionId),
      successCallback,
      errorCallback
    });
  }
}
export default Versions;
//# sourceMappingURL=Versions.js.map