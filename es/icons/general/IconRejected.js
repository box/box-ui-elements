import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconRejected = ({
  className = '',
  color = '#ED3757',
  height = 18,
  title,
  width = 18
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-rejected ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 18 18",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("circle", {
  cx: 9,
  cy: 9,
  fill: color,
  r: 9
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 7.586l2.828-2.829 1.415 1.415L10.414 9l2.829 2.828-1.415 1.415L9 10.414l-2.828 2.829-1.415-1.415L7.586 9 4.757 6.172l1.415-1.415z",
  fill: "#FFF",
  fillRule: "nonzero"
})));
export default IconRejected;
//# sourceMappingURL=IconRejected.js.map