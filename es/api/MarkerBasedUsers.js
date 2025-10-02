function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Marker-based helper for the Box Users API
 * @author Box
 */

import MarkerBasedApi from './MarkerBasedAPI';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../constants';
class MarkerBasedUsers extends MarkerBasedApi {
  /**
   * API URL for fetching all users who are visible to the current user
   *
   * @returns {string} URL for fetching users
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/users`;
  }

  /**
   * API for fetching all users in the current user's enterprise
   *
   * @param {string} id - Box item ID
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @param {Object} [requestData] - Opitional additional request data
   * @param {Object} [limit] - Max number of groups to return
   * @returns {void}
   */
  getUsersInEnterprise(id, successCallback, errorCallback, requestData, limit = DEFAULT_MAX_CONTACTS) {
    this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_USERS;
    this.markerGet({
      id,
      limit,
      successCallback,
      errorCallback,
      requestData: _objectSpread({
        usemarker: true
      }, requestData),
      shouldFetchAll: false
    });
  }
}
export default MarkerBasedUsers;
//# sourceMappingURL=MarkerBasedUsers.js.map