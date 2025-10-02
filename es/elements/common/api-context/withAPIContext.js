function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Wraps a component with the API context
 * @author Box
 */
import * as React from 'react';
import APIContext from './APIContext';
const withAPIContext = WrappedComponent => /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(APIContext.Consumer, null, api => /*#__PURE__*/React.createElement(WrappedComponent, _extends({
  ref: ref
}, props, {
  api: api
}))));
export default withAPIContext;
//# sourceMappingURL=withAPIContext.js.map