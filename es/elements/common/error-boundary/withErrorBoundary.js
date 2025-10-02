function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file withErrorBoundary HOC which adds error boundaries as well as error logging
 * @author Box
 */

import * as React from 'react';
import DefaultError from './DefaultError';
import ErrorBoundary from './ErrorBoundary';
const withErrorBoundary = (errorOrigin, errorComponent = DefaultError) => WrappedComponent => /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(ErrorBoundary, _extends({
  errorComponent: errorComponent,
  errorOrigin: errorOrigin
}, props), /*#__PURE__*/React.createElement(WrappedComponent, {
  ref: ref
})));
export default withErrorBoundary;
//# sourceMappingURL=withErrorBoundary.js.map