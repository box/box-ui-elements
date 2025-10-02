import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconSidebar = ({
  className = '',
  color = '#000',
  height = 16,
  title,
  width = 18
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-sidebar ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 18 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M13 3h2v2h-2zM13 6h2v2h-2z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M16 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM2 14V2h8v12H2zM12 2h4v12h-4V2z",
  fill: color
}));
export default IconSidebar;
//# sourceMappingURL=IconSidebar.js.map