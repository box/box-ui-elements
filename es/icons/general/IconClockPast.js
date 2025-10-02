import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconClockPast = ({
  className = '',
  color = '#444',
  height = 14,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-clock-past ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 14",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd",
  transform: "translate(0 1)"
}, /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "5",
  rx: ".5",
  width: "1",
  x: "9.66",
  y: "3"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "1",
  rx: ".5",
  width: "3",
  x: "9.66",
  y: "7"
}), /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M5.66 10.62C6.697 11.48 8.032 12 9.487 12c3.314 0 6-2.686 6-6s-2.686-6-6-6c-3.313 0-6 2.686-6 6",
  stroke: color,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M6.317 5l-2.83 2.828L.66 5",
  fill: color
})));
export default IconClockPast;
//# sourceMappingURL=IconClockPast.js.map