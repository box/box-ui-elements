import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue, white } from '../../styles/variables';
const IconTaskApproval = ({
  className = '',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconTaskApproval ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "nonzero"
}, /*#__PURE__*/React.createElement("circle", {
  className: "background-color",
  fill: bdlBoxBlue,
  cx: "16",
  cy: "16",
  r: "16"
}), /*#__PURE__*/React.createElement("g", {
  transform: "translate(8 5.333)",
  className: "foreground-color",
  fill: white
}, /*#__PURE__*/React.createElement("path", {
  d: "M11.267 6.51c-1.133 2.242-1.669 4.276-1.614 6.102.006.213-.177.388-.405.388H6.752c-.228 0-.41-.175-.405-.388.055-1.826-.481-3.86-1.614-6.102C2.953 2.986 4.557 0 8 0s5.047 2.986 3.267 6.51z"
}), /*#__PURE__*/React.createElement("rect", {
  y: "14.337",
  width: "16",
  height: "3.353",
  rx: "1.676"
}), /*#__PURE__*/React.createElement("rect", {
  x: "1.143",
  y: "18.808",
  width: "13.714",
  height: "1.192",
  rx: ".596"
}))));
export default IconTaskApproval;
//# sourceMappingURL=IconTaskApproval.js.map