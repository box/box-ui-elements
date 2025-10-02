function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Base class for the Open With ES6 wrapper
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentOpenWithReactComponent from '../content-open-with';
class ContentOpenWith extends ES6Wrapper {
  constructor(...args) {
    super(...args);
    /**
     * Callback for executing an integration
     *
     * @return {void}
     */
    _defineProperty(this, "onExecute", appIntegrationId => {
      this.emit('execute', appIntegrationId);
    });
    /**
     * Callback when an error occurs while loading or executing integrations
     *
     * @return {void}
     */
    _defineProperty(this, "onError", error => {
      this.emit('error', error);
    });
  }
  /** @inheritdoc */
  render() {
    render(/*#__PURE__*/React.createElement(ContentOpenWithReactComponent, _extends({
      componentRef: this.setComponent,
      fileId: this.id,
      language: this.language,
      messages: this.messages,
      onError: this.onError,
      onExecute: this.onExecute,
      onInteraction: this.onInteraction,
      token: this.token
    }, this.options)), this.container);
  }
}
global.Box = global.Box || {};
global.Box.ContentOpenWith = ContentOpenWith;
export default ContentOpenWith;
//# sourceMappingURL=ContentOpenWith.js.map