function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the Box Item (File/Folder) Collaborations API
 * @author Box
 */

import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS } from '../constants';
class ItemCollaborations extends MarkerBasedAPI {
  constructor(...args) {
    super(...args);
    /**
     * API for fetching collaborations on a Box item
     *
     * @param {string} id - Item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} [requestData] - Optional additional request data
     * @param {number} [limit] - Max number of collaborations to return
     * @returns {void}
     */
    _defineProperty(this, "getCollaborations", (id, successCallback, errorCallback, requestData = {}, limit = DEFAULT_MAX_COLLABORATORS) => {
      this.markerGet({
        id,
        limit,
        successCallback,
        errorCallback,
        requestData
      });
    });
    /**
     * Used by the MarkerBasedAPI after a successful call
     *
     * @param {Object} data - Response data
     */
    _defineProperty(this, "successHandler", data => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }
      this.successCallback(data); // defined in this.markerGet()
    });
  }
  /**
   * API URL for collaborations
   *
   * @param {string} id - Item ID
   * @protected
   * @return {string} Base URL for collaborations
   */
  getUrl(id) {
    return `getUrl(${id}) should be overridden`;
  }
}
export default ItemCollaborations;
//# sourceMappingURL=ItemCollaborations.js.map