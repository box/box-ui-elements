import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconSync = ({
  className = '',
  color = '#979797',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-sync ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "stroke-color",
  fill: "none",
  fillRule: "evenodd",
  stroke: color,
  transform: "translate(1 1)"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "7",
  cy: "7",
  r: "7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 7.054l2.58 2.69L10.938 5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})));
export default IconSync;
//# sourceMappingURL=IconSync.js.map