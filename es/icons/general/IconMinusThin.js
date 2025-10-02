import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconMinusThin = ({
  className = '',
  color = '#222',
  height = 1,
  title,
  width = 9
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-minus-thin ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 9 1",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M0 0h9v1H0z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconMinusThin;
//# sourceMappingURL=IconMinusThin.js.map