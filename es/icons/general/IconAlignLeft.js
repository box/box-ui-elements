import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconAlignLeft = ({
  className = '',
  color = '#444',
  height = 10,
  title,
  width = 13
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-align-left ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 13 10",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M.3.5h11.9M.3 3.5h9.3m-9.3 6h9.3m-9.3-3H5",
  fill: "none",
  stroke: color,
  strokeMiterlimit: 10
}));
export default IconAlignLeft;
//# sourceMappingURL=IconAlignLeft.js.map