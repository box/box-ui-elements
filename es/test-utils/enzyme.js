function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { mount as baseMount, shallow as baseShallow } from 'enzyme';

// Global providers that need setup
import { ThemeProvider } from 'styled-components';
import defaultTheme from '../styles/theme';

// Wrap this around every component so they can use app-wide context.
// Prevents breaking due to missing providers.
// See https://github.com/airbnb/enzyme/blob/master/docs/api/ReactWrapper/getWrappingComponent.md
/* eslint-disable react/prop-types */
const Wrappers = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: defaultTheme
  }, children);
};

/**
 * mount() from Enzyme but with required app-wide context providers included by default
 */
const mountConnected = (element, options = {}) => baseMount(element, _objectSpread({
  wrappingComponent: Wrappers
}, options));

/**
 * shallow() from Enzyme but with required app-wide context providers included by default.
 */
const shallowConnected = (element, options = {}) => baseShallow(element, _objectSpread({
  wrappingComponent: Wrappers
}, options));

// Re-export everything from Enzyme
export * from 'enzyme';
// Export wrapped methods
export { mountConnected, shallowConnected };
//# sourceMappingURL=enzyme.js.map