import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconLeftArrow = ({
  className = '',
  color = '#888888',
  height = 14,
  title,
  width = 12
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-governance ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 12 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M9.5 4.5h-9m4-4l-4 4m4 4l-4-4",
  fill: "none",
  stroke: color,
  strokeLinecap: "round"
}));
export default IconLeftArrow;
//# sourceMappingURL=IconLeftArrow.js.map