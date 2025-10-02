function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import InlineNotice from '../inline-notice';
const InlineError = props => /*#__PURE__*/React.createElement(InlineNotice, _extends({}, props, {
  type: "error"
}));
export default InlineError;
//# sourceMappingURL=InlineError.js.map