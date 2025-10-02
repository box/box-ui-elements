import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconCollaborators = ({
  className = '',
  color = '#979797',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-collaborators ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "stroke-color",
  fill: "none",
  fillRule: "evenodd",
  stroke: color,
  transform: "translate(1 1)"
}, /*#__PURE__*/React.createElement("circle", {
  cx: "7",
  cy: "7",
  r: "7"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "7",
  cy: "5",
  r: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 12c2.182-.07 3.964-1.572 4-2 .064-.758-2.895-.993-4-.993S3 9.237 3 10c0 .255 1.818 2.07 4 2z"
})));
export default IconCollaborators;
//# sourceMappingURL=IconCollaborators.js.map