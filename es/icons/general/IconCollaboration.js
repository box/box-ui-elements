import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconCollaboration = ({
  className = '',
  color = bdlBoxBlue,
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconCollaboration ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none"
}, /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  stroke: color,
  cx: "16",
  cy: "16",
  r: "15.5"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M16 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0-1a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM9.433 22.75c.061-.106.194-.307.397-.57a8.892 8.892 0 0 1 1.237-1.3C12.437 19.701 14.077 19 16 19s3.563.702 4.933 1.88c.482.413.895.858 1.237 1.3.203.263.335.464.397.57a.5.5 0 0 0 .866-.5 6.603 6.603 0 0 0-.472-.68 9.886 9.886 0 0 0-1.376-1.45C20.045 18.799 18.18 18 16 18s-4.045.798-5.585 2.12c-.536.462-.994.955-1.376 1.45-.232.3-.39.536-.472.68a.5.5 0 0 0 .866.5z",
  fill: color
})));
export default IconCollaboration;
//# sourceMappingURL=IconCollaboration.js.map