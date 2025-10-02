import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconInformation = ({
  className = '',
  color = '#444',
  height = 13,
  title,
  width = 5
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-information ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 5 13",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "fill-color",
  fill: color
}, /*#__PURE__*/React.createElement("path", {
  d: "M1 12h3V6H1v6zm0-7h3c.6 0 1 .5 1 1v6c0 .6-.4 1-1 1H1c-.6 0-1-.5-1-1V6c0-.6.4-1 1-1zM2 3h1c.6 0 1-.4 1-1s-.4-1-1-1H2c-.6 0-1 .4-1 1s.4 1 1 1zm0-3h1c1.1 0 2 .9 2 2s-.9 2-2 2H2C.9 4 0 3.1 0 2s.9-2 2-2z"
})));
export default IconInformation;
//# sourceMappingURL=IconInformation.js.map