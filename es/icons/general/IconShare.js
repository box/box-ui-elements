import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconShare = ({
  className = '',
  color = bdlBoxBlue,
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconShare ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none"
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M10.7 16.356a3.5 3.5 0 1 0 4.949 4.95l1.413-1.413a.501.501 0 0 1 .708.706l-1.414 1.414a4.5 4.5 0 0 1-6.364-6.364l1.414-1.414a.5.5 0 0 1 .707.707L10.7 16.356zm10.606-.707a3.5 3.5 0 0 0-4.95-4.95l-1.413 1.413a.501.501 0 0 1-.71-.705h.002l1.414-1.415a4.5 4.5 0 0 1 6.364 6.364l-1.414 1.414a.5.5 0 0 1-.707-.707l1.414-1.414zm-7.778 2.121l4.242-4.242a.5.5 0 0 1 .707.707l-4.242 4.242a.5.5 0 0 1-.707-.707z",
  fill: color
}), /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  stroke: color,
  cx: "16",
  cy: "16",
  r: "15.5"
})));
export default IconShare;
//# sourceMappingURL=IconShare.js.map