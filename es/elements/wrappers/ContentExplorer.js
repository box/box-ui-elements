function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Base class for the Content Explorer ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
// $FlowFixMe
import ContentExplorerReactComponent from '../content-explorer';
class ContentExplorer extends ES6Wrapper {
  constructor(...args) {
    super(...args);
    /**
     * Callback for selecting files
     *
     * @param {Array} data - chosen box items
     * @return {void}
     */
    _defineProperty(this, "onSelect", data => {
      this.emit('select', data);
    });
    /**
     * Callback for navigating into a folder
     *
     * @param {Object} data - chosen box items
     * @return {void}
     */
    _defineProperty(this, "onNavigate", data => {
      this.emit('navigate', data);
    });
    /**
     * Callback for renaming file
     *
     * @return {void}
     */
    _defineProperty(this, "onRename", data => {
      this.emit('rename', data);
    });
    /**
     * Callback for previewing a file
     *
     * @return {void}
     */
    _defineProperty(this, "onPreview", data => {
      this.emit('preview', data);
    });
    /**
     * Callback for downloading a file
     *
     * @return {void}
     */
    _defineProperty(this, "onDownload", data => {
      this.emit('download', data);
    });
    /**
     * Callback for deleting a file
     *
     * @return {void}
     */
    _defineProperty(this, "onDelete", data => {
      this.emit('delete', data);
    });
    /**
     * Callback for uploading a file
     *
     * @return {void}
     */
    _defineProperty(this, "onUpload", data => {
      this.emit('upload', data);
    });
    /**
     * Callback for creating a folder
     *
     * @return {void}
     */
    _defineProperty(this, "onCreate", data => {
      this.emit('create', data);
    });
  }
  /**
   * Helper to programatically navigate
   *
   * @param {string} id - string folder id
   * @return {void}
   */
  navigateTo(id) {
    const component = this.getComponent();
    if (component && typeof component.clearCache === 'function') {
      component.fetchFolder(id);
    }
  }

  /** @inheritdoc */
  render() {
    render(/*#__PURE__*/React.createElement(ContentExplorerReactComponent, _extends({
      language: this.language,
      messages: this.messages,
      rootFolderId: this.id,
      token: this.token,
      componentRef: this.setComponent,
      onDelete: this.onDelete,
      onDownload: this.onDownload,
      onPreview: this.onPreview,
      onRename: this.onRename,
      onSelect: this.onSelect,
      onUpload: this.onUpload,
      onCreate: this.onCreate,
      onNavigate: this.onNavigate,
      onInteraction: this.onInteraction
    }, this.options)), this.container);
  }
}
global.Box = global.Box || {};
global.Box.ContentExplorer = ContentExplorer;
export default ContentExplorer;
//# sourceMappingURL=ContentExplorer.js.map