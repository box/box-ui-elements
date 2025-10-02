function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box collaborators API
 * @author Box
 */

import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
class FileCollaborators extends MarkerBasedAPI {
  constructor(...args) {
    super(...args);
    /**
     * Transform result of API response
     *
     * @param {Object} data the response data
     */
    _defineProperty(this, "successHandler", data => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }

      // Transform into "mention selector" format:
      const collaboratorSelectorItems = data.entries.map(collab => {
        let item;
        if (collab.type === 'group') {
          item = collab; // flow needs assignment to happen after type refinement
        } else {
          item = collab;
          item.email = item.login; // transform user object
        }
        return {
          id: collab.id,
          name: collab.name,
          item
        };
      });
      this.successCallback(_objectSpread(_objectSpread({}, data), {}, {
        entries: collaboratorSelectorItems
      }));
    });
    /**
     * Fetches file @mention's
     *
     * @oaram {string} fileId
     * @param {Function} successCallback
     * @param {Function} errorCallback
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    _defineProperty(this, "getCollaboratorsWithQuery", (fileId, successCallback, errorCallback, searchStr, {
      includeGroups = false
    } = {}) => {
      // Do not fetch without filter
      if (!searchStr || searchStr.trim() === '') {
        return;
      }
      this.getFileCollaborators(fileId, successCallback, errorCallback, {
        filter_term: searchStr,
        include_groups: includeGroups,
        include_uploader_collabs: false
      });
    });
  }
  /**
   * API URL for comments
   *
   * @param {string} [id] - a box file id
   * @return {string} base url for files
   */
  getUrl(id) {
    if (!id) {
      throw new Error('Missing file id!');
    }
    return `${this.getBaseApiUrl()}/files/${id}/collaborators`;
  }
  /**
   * API for fetching collaborators on a file
   *
   * @param {string} id - the file id
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @param {Object} requestData - any additional request data
   * @param {number} limit - the max number of collaborators to return
   * @returns {void}
   */
  getFileCollaborators(id, successCallback, errorCallback, requestData = {}, limit = DEFAULT_MAX_COLLABORATORS) {
    // NOTE: successCallback is called with the result
    // of this.successHandler, not the API response!
    this.markerGet({
      id,
      limit,
      successCallback,
      errorCallback,
      requestData
    });
  }
}
export default FileCollaborators;
//# sourceMappingURL=FileCollaborators.js.map