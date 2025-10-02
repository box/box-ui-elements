import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconCalendar = ({
  className = '',
  color = '#BABABA',
  height = 17,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-calendar ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 17",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd",
  transform: "translate(0 1)"
}, /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: height,
  rx: "2",
  width: width,
  y: "2"
}), /*#__PURE__*/React.createElement("rect", {
  fill: "#FFF",
  height: "9",
  rx: "1",
  width: "13.75",
  x: "1.25",
  y: "6"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M11 7h2.5v2.5H11zM7 11h2.5v2.5H7zM3 11h2.5v2.5H3zM7 7h2.5v2.5H7zM3 7h2.5v2.5H3z",
  fill: color
})));
export default IconCalendar;
//# sourceMappingURL=IconCalendar.js.map