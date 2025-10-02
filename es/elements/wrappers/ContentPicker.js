const _excluded = ["modal"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Base class for the Content Picker ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentPickerPopup from '../content-picker/ContentPickerPopup';
import ContentPickerReactComponent from '../content-picker/ContentPicker';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK, CLIENT_NAME_CONTENT_PICKER } from '../../constants';
class ContentPicker extends ES6Wrapper {
  constructor(...args) {
    super(...args);
    /**
     * Callback for pressing choose
     *
     * @param {Array} data - chosen box items
     * @return {void}
     */
    _defineProperty(this, "onChoose", data => {
      this.emit('choose', data);
    });
    /**
     * Callback for pressing cancel
     *
     * @return {void}
     */
    _defineProperty(this, "onCancel", () => {
      this.emit('cancel');
    });
  }
  /**
   * Returns the type of content picker
   *
   * @return {void}
   */
  getType() {
    const {
      type
    } = this.options || {};
    return type || `${TYPE_FOLDER},${TYPE_FILE},${TYPE_WEBLINK}`;
  }

  /**
   * Returns the name for content picker
   *
   * @return {void}
   */
  getClientName() {
    return CLIENT_NAME_CONTENT_PICKER;
  }

  /** @inheritdoc */
  render() {
    const _this$options = this.options,
      {
        modal
      } = _this$options,
      rest = _objectWithoutProperties(_this$options, _excluded);
    const PickerComponent = modal ? ContentPickerPopup : ContentPickerReactComponent;
    render(/*#__PURE__*/React.createElement(PickerComponent, _extends({
      clientName: this.getClientName(),
      componentRef: this.setComponent,
      language: this.language,
      messages: this.messages,
      modal: modal,
      onCancel: this.onCancel,
      onChoose: this.onChoose,
      rootFolderId: this.id,
      token: this.token,
      type: this.getType()
    }, rest)), this.container);
  }
}
export default ContentPicker;
//# sourceMappingURL=ContentPicker.js.map