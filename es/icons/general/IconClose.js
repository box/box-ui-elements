import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconClose = ({
  className = '',
  color = '#000000',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-close ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  d: "M0 0h24v24H0z",
  fill: "none"
}));
export default IconClose;
//# sourceMappingURL=IconClose.js.map