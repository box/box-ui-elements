import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconPlay = ({
  className = '',
  color = '#000000',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-play ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8 5v14l11-7z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  d: "M0 0h24v24H0z",
  fill: "none"
}));
export default IconPlay;
//# sourceMappingURL=IconPlay.js.map