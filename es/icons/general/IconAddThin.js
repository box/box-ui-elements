import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconAddThin = ({
  className = '',
  color = '#222222',
  height = 17,
  title,
  width = 17
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-add-thin ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 17 17",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8 0h1v17H8z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M17 8v1H0V8z",
  fill: color
}));
export default IconAddThin;
//# sourceMappingURL=IconAddThin.js.map