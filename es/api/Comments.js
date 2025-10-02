function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box comments API
 * @author Box
 */

import { COMMENTS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_DELETE, PERMISSION_CAN_EDIT, ERROR_CODE_CREATE_COMMENT, ERROR_CODE_UPDATE_COMMENT, ERROR_CODE_DELETE_COMMENT, ERROR_CODE_FETCH_COMMENTS } from '../constants';
class Comments extends OffsetBasedAPI {
  constructor(...args) {
    super(...args);
    /**
     * Formats the comments api response to usable data
     * @param {Object} data the api response data
     */
    _defineProperty(this, "successHandler", data => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }

      // There is no response data when deleting a comment
      if (!data) {
        this.successCallback();
        return;
      }

      // We don't have entries when updating/creating a comment
      if (!data.entries) {
        this.successCallback(this.format(data));
        return;
      }
      const comments = data.entries.map(this.format);
      this.successCallback(_objectSpread(_objectSpread({}, data), {}, {
        entries: comments
      }));
    });
  }
  /**
   * API URL for comments on a file
   *
   * @param {string} id - A box file id
   * @return {string} base url for files
   */
  getUrl(id) {
    if (!id) {
      throw new Error('Missing file id!');
    }
    return `${this.getBaseApiUrl()}/files/${id}/comments`;
  }

  /**
   * API URL for comments endpoint
   *
   * @param {string} [id] - A box comment id
   * @return {string} base url for comments
   */
  commentsUrl(id) {
    const baseUrl = `${this.getBaseApiUrl()}/comments`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  }

  /**
   * Formats comment data for use in components.
   *
   * @param {string} [id] - An individual comment entry from the API
   * @return {Task} A task
   */
  format(comment) {
    return _objectSpread(_objectSpread({}, comment), {}, {
      tagged_message: comment.tagged_message !== '' ? comment.tagged_message : comment.message
    });
  }
  /**
   * API for creating a comment on a file
   *
   * @param {BoxItem} file - File object for which we are creating a comment
   * @param {string} message - Comment message
   * @param {string} taggedMessage - Comment message with @mentions
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  createComment({
    file,
    message,
    taggedMessage,
    successCallback,
    errorCallback
  }) {
    this.errorCode = ERROR_CODE_CREATE_COMMENT;
    const {
      id = '',
      permissions
    } = file;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    const requestData = {
      data: {
        item: {
          id,
          type: 'file'
        },
        message,
        tagged_message: taggedMessage
      },
      params: {
        fields: COMMENTS_FIELDS_TO_FETCH.toString()
      }
    };
    this.post({
      id,
      url: this.commentsUrl(),
      data: requestData,
      successCallback,
      errorCallback
    });
  }

  /**
   * API for updating a comment on a file
   *
   * @param {BoxItem} file - File object for which we are updating a comment
   * @param {string} commentId - Comment to be edited
   * @param {string} message - Comment message
   * @param {BoxCommentPermission} permissions - The known permissions of the comment we're updating
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  updateComment({
    file,
    commentId,
    message,
    tagged_message,
    permissions,
    successCallback,
    errorCallback
  }) {
    this.errorCode = ERROR_CODE_UPDATE_COMMENT;
    const {
      id = ''
    } = file;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_EDIT, permissions, id);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    const requestData = {
      data: {
        message,
        tagged_message
      }
    };
    this.put({
      id,
      url: this.commentsUrl(commentId),
      data: requestData,
      successCallback,
      errorCallback
    });
  }

  /**
   * API for deleting a comment on a file
   *
   * @param {BoxItem} file - File object for which we are deleting a comment
   * @param {string} commentId - Id of the comment we are deleting
   * @param {BoxCommentPermission} permissions - The known permissions of the comment we're deleting
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  deleteComment({
    file,
    commentId,
    permissions,
    successCallback,
    errorCallback
  }) {
    this.errorCode = ERROR_CODE_DELETE_COMMENT;
    const {
      id = ''
    } = file;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, id);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.delete({
      id,
      url: this.commentsUrl(commentId),
      successCallback,
      errorCallback
    });
  }

  /**
   * API for fetching comments on a file
   *
   * @param {string} fileId - the file id
   * @param {BoxItemPermission} permissions - the permissions for the file
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @param {array} fields - the fields to fetch
   * @param {number} offset - the offset from the start to start fetching at
   * @param {number} limit - the number of items to fetch
   * @param {boolean} shouldFetchAll - true if should get all the pages before calling the sucessCallback
   * @returns {void}
   */
  getComments(fileId, permissions, successCallback, errorCallback, fields = COMMENTS_FIELDS_TO_FETCH, offset, limit, shouldFetchAll) {
    this.errorCode = ERROR_CODE_FETCH_COMMENTS;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
  }
}
export default Comments;
//# sourceMappingURL=Comments.js.map