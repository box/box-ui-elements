import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconLock = ({
  className = '',
  color = '#444',
  height = 14,
  opacity = 1,
  title,
  width = 13
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-lock ${className}`,
  height: height,
  opacity: opacity,
  title: title,
  viewBox: "0 0 13 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M3 5v.5h7c.8 0 1.5.7 1.5 1.5v4c0 .8-.7 1.5-1.5 1.5H3c-.8 0-1.5-.7-1.5-1.5V7c0-.8.7-1.5 1.5-1.5v-1C1.6 4.5.5 5.6.5 7v4c0 1.4 1.1 2.5 2.5 2.5h7c1.4 0 2.5-1.1 2.5-2.5V7c0-1.4-1.1-2.5-2.5-2.5H3V5z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M5.2 9h3c.3 0 .5.2.5.5s-.3.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M3 5c0-1.9 1.6-3.5 3.5-3.5V1v.5C8.4 1.5 10 3.1 10 5c0 .3.2.5.5.5s.5-.2.5-.5C11 2.5 9 .5 6.5.5S2 2.5 2 5c0 .3.2.5.5.5S3 5.3 3 5z",
  fill: color
}));
export default IconLock;
//# sourceMappingURL=IconLock.js.map