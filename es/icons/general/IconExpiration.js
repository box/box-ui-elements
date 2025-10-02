import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconExpiration = ({
  className = '',
  color = '#444444',
  height = 15,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-expiration ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 15",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd",
  transform: "translate(0 -1)"
}, /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  cx: "7.16",
  cy: "9.5",
  r: "5.5",
  stroke: color
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "5",
  rx: ".5",
  width: "1",
  x: "6.66",
  y: "6"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "1",
  rx: ".5",
  width: "3",
  x: "6.66",
  y: "10"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "1",
  rx: ".5",
  transform: "rotate(30 11.16 2.5)",
  width: "5",
  x: "8.66",
  y: "2"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "1",
  rx: ".5",
  transform: "rotate(-30 3.16 2.5)",
  width: "5",
  x: ".66",
  y: "2"
})));
export default IconExpiration;
//# sourceMappingURL=IconExpiration.js.map