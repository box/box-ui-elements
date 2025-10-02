import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconAlert = ({
  className = '',
  color = '#000000',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-alert ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconAlert;
//# sourceMappingURL=IconAlert.js.map