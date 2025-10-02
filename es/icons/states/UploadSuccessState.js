import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue } from '../../styles/variables';
const UploadSuccessState = ({
  className = '',
  color = bdlBoxBlue,
  height = 49,
  title,
  width = 50
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `upload-success-state ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 50 49",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M41.88,4.39l4,4.53L17,38.73,4.24,26,9,21.28l5.89,6.09L17,29.57l2.16-2.18,22.74-23M42,0,17,25.28,9,17,0,26,17,43,50,9,42,0Z",
  fill: color
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  fillOpacity: "0.2",
  height: "3",
  rx: "1.5",
  ry: "1.5",
  width: "6",
  x: "4",
  y: "46"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  fillOpacity: "0.2",
  height: "3",
  rx: "1.5",
  ry: "1.5",
  width: "6",
  x: "33",
  y: "46"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fill: color,
  fillOpacity: "0.2",
  height: "3",
  rx: "1.5",
  ry: "1.5",
  width: "21",
  x: "11",
  y: "46"
}));
export default UploadSuccessState;
//# sourceMappingURL=UploadSuccessState.js.map