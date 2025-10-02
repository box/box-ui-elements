import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconRetention = ({
  className = '',
  color = '#FFFFFF',
  height = 14,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-retention ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M1,14h14V7H1V14z M6,8h4c0.5,0,1,0.4,1,1c0,0.6-0.5,1-1,1H6c-0.5,0-1-0.4-1-1C5,8.4,5.5,8,6,8z",
  fill: color
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  height: "2",
  width: "16",
  y: "4"
}), /*#__PURE__*/React.createElement("polygon", {
  className: "fill-color",
  fill: color,
  points: "13,0 3,0 0,3 16,3"
}));
export default IconRetention;
//# sourceMappingURL=IconRetention.js.map