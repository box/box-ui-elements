import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconAlertCircle = ({
  className = '',
  color = '#FFFFFF',
  height = 20,
  title,
  width = 20
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-alert-circle ${className}`,
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
  y: "4"
}), /*#__PURE__*/React.createElement("circle", {
  className: "fill-color",
  cx: "9",
  cy: "13",
  fill: color,
  r: "1"
})));
export default IconAlertCircle;
//# sourceMappingURL=IconAlertCircle.js.map