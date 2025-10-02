const _excluded = ["children", "tooltip"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import Tooltip, { TooltipPosition } from '../tooltip';
import LabelPrimitive from './LabelPrimitive';
const StandardLabel = _ref => {
  let {
      children,
      tooltip
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const label = /*#__PURE__*/React.createElement(LabelPrimitive, rest, children);
  return tooltip ? /*#__PURE__*/React.createElement(Tooltip, {
    position: TooltipPosition.TOP_RIGHT,
    text: tooltip
  }, label) : label;
};
export default StandardLabel;
//# sourceMappingURL=StandardLabel.js.map