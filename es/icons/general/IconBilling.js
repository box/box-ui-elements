import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconBilling = ({
  className = '',
  color = '#888888',
  height = 10,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-billing ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 10",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "stroke-color",
  fill: "none",
  fillRule: "evenodd",
  stroke: color
}, /*#__PURE__*/React.createElement("rect", {
  height: "9",
  rx: "1",
  width: "13",
  x: ".5",
  y: ".5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7.5 7.5h-5m8 0h-1",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  d: "M1.5 3h11",
  strokeLinecap: "square",
  strokeWidth: "2"
})));
export default IconBilling;
//# sourceMappingURL=IconBilling.js.map