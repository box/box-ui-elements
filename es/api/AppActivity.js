function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box App Activity API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import { ERROR_CODE_DELETE_APP_ACTIVITY, HTTP_STATUS_CODE_NOT_FOUND } from '../constants';
import { APP_ACTIVITY_FIELDS_TO_FETCH } from '../utils/fields';
class AppActivity extends MarkerBasedAPI {
  constructor(...args) {
    super(...args);
    /** @property {BoxItemPermission} - Placeholder permissions object to determine if app activity can be deleted */
    _defineProperty(this, "permissions", {});
    /**
     * Map an entry from the AppActivityAPIItem to an AppActivityItem.
     * occurred_at -> created_at
     * Adds permissions to item
     *
     * @param {AppActivityAPIItem} item - A single entry in the AppActivity API entries list
     *
     * @return {AppActivityItem}
     */
    _defineProperty(this, "mapAppActivityItem", item => {
      const {
        activity_template,
        app,
        created_by,
        id,
        occurred_at,
        rendered_text,
        type
      } = item;
      const {
        can_delete
      } = this.permissions;
      return {
        activity_template,
        app,
        created_at: occurred_at,
        created_by,
        id,
        permissions: {
          can_delete
        },
        rendered_text,
        type
      };
    });
    /**
     * Generic success handler
     *
     * @param {AppActivityAPIItems} data - the response data
     */
    _defineProperty(this, "successHandler", ({
      entries = []
    }) => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }
      const activityEntries = entries.map(this.mapAppActivityItem);
      this.successCallback({
        entries: activityEntries,
        total_count: activityEntries.length
      });
    });
    /**
     * Generic error handler
     *
     * @param {AxiosError} error - the error response
     */
    _defineProperty(this, "errorHandler", error => {
      if (this.isDestroyed() && typeof this.errorCallback !== 'function') {
        return;
      }
      const {
        response
      } = error;

      // In the case of a 404, the enterprise does not have App Activities enabled.
      // Show no App Activity
      if (response.status === HTTP_STATUS_CODE_NOT_FOUND) {
        this.successHandler({
          entries: [],
          total_count: 0
        });
      } else {
        this.errorCallback(error, response.status);
      }
    });
  }
  /**
   * API URL for getting App Activity on a file
   *
   * @return {string} Url for all app activity on a file
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/app_activities`;
  }

  /**
   * API URL for deleting app activity from a file
   *
   * @param id - ID of an app activity item
   * @return {string} - URL to delete app activity
   */
  getDeleteUrl(id) {
    if (!id) {
      throw new Error('Missing file id!');
    }
    return `${this.getUrl()}/${id}`;
  }
  /**
   * API for fetching App Activity on a file
   *
   * @param {string} id - the file id
   * @param {BoxItemPermission} permissions - Permissions to attach to the app activity items. Determines if it can be deleted.
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @param {number} [limit] - the max number of app activity items to return.
   *
   * @returns {void}
   */
  getAppActivity(id, permissions, successCallback, errorCallback) {
    const requestData = {
      item_id: id,
      item_type: 'file',
      fields: APP_ACTIVITY_FIELDS_TO_FETCH.toString()
    };
    this.permissions = permissions;
    this.markerGet({
      id,
      successCallback,
      errorCallback,
      requestData
    });
  }

  /**
   * Delete an app activity item
   *
   * @param {string} id - The ID of the Box file that App Activity is on
   * @param {string} appActivityId - An AppActivity item id
   * @param {Function} successCallback - The success callback
   * @param {Function} errorCallback - The error callback
   */
  deleteAppActivity({
    id,
    appActivityId,
    successCallback,
    errorCallback
  }) {
    this.errorCode = ERROR_CODE_DELETE_APP_ACTIVITY;
    this.delete({
      id,
      url: this.getDeleteUrl(appActivityId),
      successCallback,
      errorCallback
    });
  }
}
export default AppActivity;
//# sourceMappingURL=AppActivity.js.map