import * as React from 'react';
import { bdlGray50, white } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconWorkflow = ({
  className = '',
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconWorkflow ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "nonzero"
}, /*#__PURE__*/React.createElement("rect", {
  className: "background-color",
  rx: "6",
  ry: "6",
  width: "32",
  height: "32",
  fill: bdlGray50
}), /*#__PURE__*/React.createElement("path", {
  className: "foreground-color",
  transform: "translate(8 8)",
  d: "M7,8H5a2,2,0,0,0,0,4H8a1,1,0,0,1,0,2H5A4,4,0,0,1,5,6h6.5a1.5,1.5,0,0,0,0-3H6A1,1,0,0,1,6,1h5.5a3.5,3.5,0,0,1,0,7ZM2,3A1,1,0,1,1,3,2,1,1,0,0,1,2,3ZM13,15a2,2,0,1,1,2-2A2,2,0,0,1,13,15Z",
  fill: white,
  fillRule: "evenodd"
})));
export default IconWorkflow;
//# sourceMappingURL=IconWorkflow.js.map