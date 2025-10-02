const _excluded = ["children", "errorComponent"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Error Boundary
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { ERROR_CODE_UNEXPECTED_EXCEPTION, IS_ERROR_DISPLAYED } from '../../../constants';
import DefaultError from './DefaultError';
class ErrorBoundary extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {});
    /**
     * Formats the error and emits it to the top level onError prop
     *
     * @param {Error} error - the error which occurred
     * @param {string} type - the error type to identify where the error occurred
     * @param {string} code - the error code to identify what error occurred
     * @param {Object} contextInfo - additional information which may be useful for the consumer of the error
     * @return {void}
     */
    _defineProperty(this, "handleError", (error, code, contextInfo = {}, origin = this.props.errorOrigin) => {
      if (!error || !code || !origin) {
        return;
      }
      const elementsError = {
        type: 'error',
        code,
        message: error.message,
        origin,
        context_info: _objectSpread({
          [IS_ERROR_DISPLAYED]: true
        }, contextInfo)
      };
      this.props.onError(elementsError);
    });
  }
  componentDidCatch(error, info) {
    this.setState({
      error
    }, () => {
      this.handleError(error, ERROR_CODE_UNEXPECTED_EXCEPTION, _objectSpread({}, info), this.props.errorOrigin);
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        errorComponent: ErrorComponent
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      error
    } = this.state;
    if (error) {
      return /*#__PURE__*/React.createElement(ErrorComponent, {
        error: error
      });
    }
    return /*#__PURE__*/React.cloneElement(children, _objectSpread(_objectSpread({}, rest), {}, {
      onError: this.handleError
    }));
  }
}
_defineProperty(ErrorBoundary, "defaultProps", {
  errorComponent: DefaultError,
  onError: noop
});
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map