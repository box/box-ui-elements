function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Decorates a component with logging methods
 * @author Box
 */
import * as React from 'react';
import Logger from './Logger';
const withLogger = source => WrappedComponent => /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(Logger, _extends({}, props, {
  source: source
}), /*#__PURE__*/React.createElement(WrappedComponent, {
  ref: ref
})));
export default withLogger;
//# sourceMappingURL=withLogger.js.map