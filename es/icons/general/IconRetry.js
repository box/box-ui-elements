import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray } from '../../styles/variables';
const IconRetry = ({
  className = '',
  color = bdlGray,
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconRetry ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "fill-color",
  fill: color,
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  d: "M25.023 16c0-6.075-4.925-11-11-11s-11 4.925-11 11 4.925 11 11 11c2.601 0 5.06-.904 7.02-2.53a1 1 0 1 1 1.278 1.538A12.949 12.949 0 0 1 14.023 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13a1 1 0 0 1-2 0z",
  fillRule: "nonzero"
}), /*#__PURE__*/React.createElement("path", {
  d: "M20 14l6 6 6-6z"
})));
export default IconRetry;
//# sourceMappingURL=IconRetry.js.map