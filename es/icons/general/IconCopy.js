import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconCopy = ({
  className = '',
  color = '#999',
  height = 14,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-copy ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M1 11a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2H2v8a1 1 0 0 1-1 1z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M13 3H3v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm-3 8H7a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2zm0-3H7a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2z",
  fill: color
}));
export default IconCopy;
//# sourceMappingURL=IconCopy.js.map