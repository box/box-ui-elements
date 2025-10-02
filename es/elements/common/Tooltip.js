const _excluded = ["children", "isDisabled", "text"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Wrapper to conditionally add a tooltip
 * @author Box
 */

import * as React from 'react';
import TooltipCore from '../../components/tooltip/Tooltip';
const Tooltip = _ref => {
  let {
      children,
      isDisabled,
      text
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  if (isDisabled || !text) {
    return children;
  }
  return /*#__PURE__*/React.createElement(TooltipCore, _extends({
    text: text
  }, rest), children);
};
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map