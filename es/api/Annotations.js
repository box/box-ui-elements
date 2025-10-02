function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import merge from 'lodash/merge';
import { ERROR_CODE_CREATE_ANNOTATION, ERROR_CODE_CREATE_REPLY, ERROR_CODE_DELETE_ANNOTATION, ERROR_CODE_EDIT_ANNOTATION, ERROR_CODE_FETCH_ANNOTATION, ERROR_CODE_FETCH_ANNOTATIONS, ERROR_CODE_FETCH_REPLIES, PERMISSION_CAN_CREATE_ANNOTATIONS, PERMISSION_CAN_DELETE, PERMISSION_CAN_EDIT, PERMISSION_CAN_VIEW_ANNOTATIONS, PERMISSION_CAN_RESOLVE } from '../constants';
import MarkerBasedApi from './MarkerBasedAPI';
import { formatComment } from './utils';
export default class Annotations extends MarkerBasedApi {
  constructor(...args) {
    super(...args);
    /**
     * Formats the annotations api response to usable data
     * @param {Object} data the api response data
     */
    _defineProperty(this, "successHandler", data => {
      if (this.isDestroyed() || typeof this.successCallback !== 'function') {
        return;
      }

      // There is no response data when deleting an annotation
      if (!data) {
        this.successCallback();
        return;
      }

      // We don't have entries when updating/creating an annotation
      if (!data.entries) {
        // Check if the response is a comment (result of createAnnotationReply)
        if (data.type && data.type === 'comment') {
          this.successCallback(formatComment(data));
          return;
        }
        this.successCallback(this.formatReplies(data));
        return;
      }

      // Check if the response is the replies of an annotation (result of getAnnotationReplies)
      if (data.entries.length && data.entries[0].type === 'comment') {
        const replies = data.entries.map(formatComment);
        this.successCallback(_objectSpread(_objectSpread({}, data), {}, {
          entries: replies
        }));
        return;
      }
      const annotations = data.entries.map(this.formatReplies);
      this.successCallback(_objectSpread(_objectSpread({}, data), {}, {
        entries: annotations
      }));
    });
  }
  /**
   * Formats annotation replies' comment data for use in components.
   *
   * @param {Annotation} annotation - An individual annotation entry from the API
   * @return {Annotation} Updated annotation
   */
  formatReplies(annotation) {
    if (!annotation.replies || !annotation.replies.length) {
      return annotation;
    }
    return _objectSpread(_objectSpread({}, annotation), {}, {
      replies: annotation.replies.map(formatComment)
    });
  }
  getUrl() {
    return `${this.getBaseApiUrl()}/undoc/annotations`;
  }
  getUrlForId(annotationId) {
    return `${this.getUrl()}/${annotationId}`;
  }
  getUrlWithRepliesForId(annotationId) {
    return `${this.getUrlForId(annotationId)}/replies`;
  }
  createAnnotation(fileId, fileVersionId, payload, permissions, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_CREATE_ANNOTATION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_CREATE_ANNOTATIONS, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    const defaults = {
      description: {
        type: 'reply'
      },
      file_version: {
        id: fileVersionId,
        type: 'file_version'
      }
    };
    this.post({
      id: fileId,
      data: {
        data: merge(defaults, payload)
      },
      errorCallback,
      successCallback,
      url: this.getUrl()
    });
  }
  updateAnnotation(fileId, annotationId, permissions, payload, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_EDIT_ANNOTATION;
    const {
      message,
      status
    } = payload;
    if (message) {
      try {
        this.checkApiCallValidity(PERMISSION_CAN_EDIT, permissions, fileId);
      } catch (e) {
        errorCallback(e, this.errorCode);
        return;
      }
    }
    if (status) {
      try {
        this.checkApiCallValidity(PERMISSION_CAN_RESOLVE, permissions, fileId);
      } catch (e) {
        errorCallback(e, this.errorCode);
        return;
      }
    }
    this.put({
      id: fileId,
      data: {
        data: {
          description: message ? {
            message
          } : undefined,
          status
        }
      },
      errorCallback,
      successCallback,
      url: this.getUrlForId(annotationId)
    });
  }
  deleteAnnotation(fileId, annotationId, permissions, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_DELETE_ANNOTATION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.delete({
      id: fileId,
      errorCallback,
      successCallback,
      url: this.getUrlForId(annotationId)
    });
  }
  getAnnotation(fileId, annotationId, permissions, successCallback, errorCallback, shouldFetchReplies) {
    this.errorCode = ERROR_CODE_FETCH_ANNOTATION;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    const requestData = shouldFetchReplies ? {
      params: {
        fields: 'replies'
      }
    } : undefined;
    this.get({
      id: fileId,
      errorCallback,
      successCallback,
      url: this.getUrlForId(annotationId),
      requestData
    });
  }
  getAnnotations(fileId, fileVersionId, permissions, successCallback, errorCallback, limit, shouldFetchAll, shouldFetchReplies) {
    this.errorCode = ERROR_CODE_FETCH_ANNOTATIONS;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    const requestData = _objectSpread({
      file_id: fileId,
      file_version_id: fileVersionId
    }, shouldFetchReplies ? {
      fields: 'replies'
    } : null);
    this.markerGet({
      id: fileId,
      errorCallback,
      limit,
      requestData,
      shouldFetchAll,
      successCallback
    });
  }
  getAnnotationReplies(fileId, annotationId, permissions, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_FETCH_REPLIES;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.get({
      id: fileId,
      errorCallback,
      successCallback,
      url: this.getUrlWithRepliesForId(annotationId)
    });
  }
  createAnnotationReply(fileId, annotationId, permissions, message, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_CREATE_REPLY;
    try {
      this.checkApiCallValidity(PERMISSION_CAN_CREATE_ANNOTATIONS, permissions, fileId);
    } catch (e) {
      errorCallback(e, this.errorCode);
      return;
    }
    this.post({
      id: fileId,
      data: {
        data: {
          message
        }
      },
      errorCallback,
      successCallback,
      url: `${this.getUrlWithRepliesForId(annotationId)}?file_id=${fileId}`
    });
  }
}
//# sourceMappingURL=Annotations.js.map