import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconPointAnnotation = ({
  className = '',
  color = bdlBoxBlue,
  height = 21,
  title,
  width = 22
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-annotation-point ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 22 21",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M11 21l-4-4H1.99C.89 17 0 16.11 0 15V2C0 .895.89 0 1.99 0h18.02C21.11 0 22 .89 22 2v13c0 1.105-.89 2-1.99 2H15l-4 4zm-7-9.5c0-.276.228-.5.51-.5h8.98c.282 0 .51.232.51.5 0 .276-.228.5-.51.5H4.51c-.282 0-.51-.232-.51-.5zm0-3c0-.276.23-.5.5-.5h11c.276 0 .5.232.5.5 0 .276-.23.5-.5.5h-11c-.276 0-.5-.232-.5-.5zm0-3c0-.276.22-.5.498-.5h13.004c.275 0 .498.232.498.5 0 .276-.22.5-.498.5H4.498C4.223 6 4 5.768 4 5.5z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconPointAnnotation;
//# sourceMappingURL=IconPointAnnotation.js.map