function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box File Activity API
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_FETCH_ACTIVITY, FILE_ACTIVITY_TYPE_ANNOTATION, FILE_ACTIVITY_TYPE_COMMENT, PERMISSION_CAN_COMMENT, PERMISSION_CAN_VIEW_ANNOTATIONS } from '../constants';
// We only show the latest reply in the UI
const REPLY_LIMIT = 1;
const getFileActivityQueryParams = (fileID, activityTypes = [], shouldShowReplies = false) => {
  const baseEndpoint = `/file_activities?file_id=${fileID}`;
  const hasActivityTypes = !!activityTypes && !!activityTypes.length;
  const enableReplies = shouldShowReplies ? 'true' : 'false';
  const enabledRepliesQueryParam = `&enable_replies=${enableReplies}&reply_limit=${REPLY_LIMIT}`;
  const activityTypeQueryParam = hasActivityTypes ? `&activity_types=${activityTypes.join()}` : '';
  return `${baseEndpoint}${activityTypeQueryParam}${enabledRepliesQueryParam}`;
};
class FileActivities extends Base {
  /**
   * API URL for filtered file activities
   *
   * @param {string} [id] - a box file id
   * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
   * @param {boolean} shouldShowReplies - optional. Specify if replies should be included in the response
   * @return {string} base url for files
   */
  getFilteredUrl(id, activityTypes, shouldShowReplies) {
    return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, activityTypes, shouldShowReplies)}`;
  }

  /**
   * API for fetching file activities
   *
   * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
   * @param {Function} errorCallback - the error callback
   * @param {string} fileId - the file id
   * @param {BoxItemPermission} permissions - the permissions for the file
   * @param {number} repliesCount - number of replies to return, by default all replies are returned
   * @param {boolean} shouldShowReplies - specify if replies should be included in the response
   * @param {Function} successCallback - the success callback
   * @returns {void}
   */
  getActivities({
    activityTypes,
    errorCallback,
    fileID,
    permissions,
    repliesCount,
    shouldShowReplies,
    successCallback
  }) {
    this.errorCode = ERROR_CODE_FETCH_ACTIVITY;
    try {
      if (!fileID) {
        throw new Error('Missing file id!');
      }
      if (activityTypes.includes(FILE_ACTIVITY_TYPE_COMMENT)) {
        this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileID);
      }
      if (activityTypes.includes(FILE_ACTIVITY_TYPE_ANNOTATION)) {
        this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileID);
      }
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.get({
      id: fileID,
      successCallback,
      errorCallback,
      requestData: _objectSpread({}, repliesCount ? {
        replies_count: repliesCount
      } : null),
      url: this.getFilteredUrl(fileID, activityTypes, shouldShowReplies)
    });
  }
}
export default FileActivities;
//# sourceMappingURL=FileActivities.js.map