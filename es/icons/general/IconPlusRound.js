import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';
const IconPlusRound = ({
  className = '',
  color = bdlGray80,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconPlusRound ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M7.428 7.428V3.567a.572.572 0 0 1 1.144 0v3.86h3.861a.572.572 0 0 1 0 1.145h-3.86v3.861a.572.572 0 0 1-1.145 0v-3.86H3.567a.572.572 0 0 1 0-1.145h3.86zM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconPlusRound;
//# sourceMappingURL=IconPlusRound.js.map