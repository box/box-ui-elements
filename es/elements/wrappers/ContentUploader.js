const _excluded = ["modal"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Base class for the Content Uploader ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
// $FlowFixMe
import ContentUploaderPopup from '../content-uploader/ContentUploaderPopup';
// $FlowFixMe
import WrappedContentUploaderComponent from '../content-uploader/ContentUploader';
class ContentUploader extends ES6Wrapper {
  constructor(...args) {
    super(...args);
    /**
     * Callback on closing uploader. Emits 'close' event.
     *
     * @return {void}
     */
    _defineProperty(this, "onClose", () => {
      this.emit('close');
    });
    /**
     * Callback when all files finish uploading. Emits 'complete' event with Box File objects of uploaded items as data.
     *
     * @param {Array} data - Completed upload items
     * @return {void}
     */
    _defineProperty(this, "onComplete", data => {
      this.emit('complete', data);
    });
    /**
     * Callback on a single upload error. Emits 'uploaderror' event with information about the failed upload.
     *
     * @param {Object} data - File and error info about failed upload
     * @return {void}
     */
    _defineProperty(this, "onError", data => {
      this.emit('error', data);
    });
    /**
     * Callback on a single pre-uploaded file. Emits 'beforeupload' event with the Box File object pre-upload.
     *
     * @param {Object} data - Upload item
     * @return {void}
     */
    _defineProperty(this, "onBeforeUpload", data => {
      this.emit('beforeupload', data);
    });
    /**
     * Callback on a single successful upload. Emits 'uploadsuccess' event with Box File object of uploaded item.
     *
     * @param {BoxItem} data - Successfully uploaded item
     * @return {void}
     */
    _defineProperty(this, "onUpload", data => {
      this.emit('upload', data);
    });
  }
  /** @inheritdoc */
  render() {
    const _this$options = this.options,
      {
        modal
      } = _this$options,
      rest = _objectWithoutProperties(_this$options, _excluded);
    const UploaderComponent = modal ? ContentUploaderPopup : WrappedContentUploaderComponent;
    render(/*#__PURE__*/React.createElement(UploaderComponent, _extends({
      language: this.language,
      messages: this.messages,
      componentRef: this.setComponent,
      rootFolderId: this.id,
      token: this.token,
      onClose: this.onClose,
      onComplete: this.onComplete,
      onError: this.onError,
      onBeforeUpload: this.onBeforeUpload,
      onUpload: this.onUpload,
      modal: modal
    }, rest)), this.container);
  }
}
global.Box = global.Box || {};
global.Box.ContentUploader = ContentUploader;
export default ContentUploader;
//# sourceMappingURL=ContentUploader.js.map