import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue, white } from '../../styles/variables';
const IconLightning = ({
  className = '',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconLightning ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("circle", {
  className: "background-color",
  fill: bdlBoxBlue,
  cx: "16",
  cy: "16",
  r: "12"
}), /*#__PURE__*/React.createElement("polygon", {
  className: "foreground-color",
  fill: white,
  points: "19.3333333 8 11 17.6 14.3333333 17.6 12.6666667 24 21 14.4 17.6666667 14.4"
}));
export default IconLightning;
//# sourceMappingURL=IconLightning.js.map