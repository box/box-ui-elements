import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconCaretDown = ({
  className = '',
  color = '#000',
  height = 6,
  title,
  width = 10
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-caret-down ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 10 6",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M0 .5l5 5 5-5H0z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconCaretDown;
//# sourceMappingURL=IconCaretDown.js.map