import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconStar = ({
  className = '',
  color = '#979797',
  height = 14,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-star ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M7 10.5l-4.114 2.163.785-4.58L.344 4.836l4.6-.67L7 0l2.057 4.168 4.6.67L10.33 8.08l.784 4.58z",
  fill: "none",
  fillRule: "evenodd",
  stroke: color
}));
export default IconStar;
//# sourceMappingURL=IconStar.js.map