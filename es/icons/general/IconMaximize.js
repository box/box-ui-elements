import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconMaximize = ({
  className = '',
  color = '#000000',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-maximize ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8 8V3H2v5h6zm1 0v1H1V1h8v7z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconMaximize;
//# sourceMappingURL=IconMaximize.js.map