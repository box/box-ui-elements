import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconApps = ({
  className = '',
  color = '#888888',
  height = 14,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-apps ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M.5.5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3zm-10 5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3zm-10 5h3v3h-3zm5 0h3v3h-3zm5 0h3v3h-3z",
  fill: "none",
  stroke: color,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));
export default IconApps;
//# sourceMappingURL=IconApps.js.map