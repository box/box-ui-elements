import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconInfoThin = ({
  className = '',
  color = '#FFFFFF',
  height = 20,
  title,
  width = 20
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-info-thin ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 20 20",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd",
  transform: "translate(1 1)"
}, /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  cx: "9",
  cy: "9",
  r: "9",
  stroke: color
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "6",
  rx: "1",
  width: "2",
  x: "8",
  y: "8"
}), /*#__PURE__*/React.createElement("circle", {
  className: "fill-color",
  cx: "9",
  cy: "5",
  fill: color,
  r: "1"
})));
export default IconInfoThin;
//# sourceMappingURL=IconInfoThin.js.map