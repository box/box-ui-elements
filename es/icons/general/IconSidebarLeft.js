import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconSidebarLeft = ({
  className = '',
  color = '#222',
  height = 18,
  title,
  width = 18
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-sidebar-left ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 18 18",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M5 6H3V4h2v2zm0 3H3V7h2v2z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M0 3v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2H2C.9 1 0 1.9 0 3zm8 12V3h8v12H8zm-2 0H2V3h4v12z",
  fill: color
}));
export default IconSidebarLeft;
//# sourceMappingURL=IconSidebarLeft.js.map