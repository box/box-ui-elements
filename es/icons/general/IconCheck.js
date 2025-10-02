import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconCheck = ({
  className = '',
  color = '#000000',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-check ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  d: "M0 0h24v24H0z",
  fill: "none"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  fill: color
}));
export default IconCheck;
//# sourceMappingURL=IconCheck.js.map