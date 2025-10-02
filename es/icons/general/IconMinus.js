import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconMinus = ({
  className = '',
  color = '#000000',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-minus ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  d: "M2 5h8v2H2z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconMinus;
//# sourceMappingURL=IconMinus.js.map