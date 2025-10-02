import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconEllipsis = ({
  className = '',
  color = '#000000',
  height = 20,
  title,
  width = 20
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-ellipsis ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 10 2",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M1 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm8 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM5 2c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconEllipsis;
//# sourceMappingURL=IconEllipsis.js.map