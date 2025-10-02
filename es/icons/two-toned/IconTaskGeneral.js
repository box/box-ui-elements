import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue, white } from '../../styles/variables';
const IconTaskGeneral = ({
  className = '',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconTaskGeneral ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fillRule: "nonzero",
  fill: "none"
}, /*#__PURE__*/React.createElement("circle", {
  className: "background-color",
  fill: bdlBoxBlue,
  cx: "16.162",
  cy: "16.162",
  r: "16"
}), /*#__PURE__*/React.createElement("path", {
  d: "M11.717 8.162v.889c0 1.472.995 2.666 2.222 2.666h4.445c1.227 0 2.222-1.194 2.222-2.666v-.89h1.281c.766 0 1.386.62 1.386 1.386v13.23c0 .764-.62 1.385-1.386 1.385H10.436c-.765 0-1.385-.62-1.385-1.386V9.546c0-.764.62-1.384 1.385-1.384h1.281zm6.463 6.503l-2.741 2.924-1.354-1.203a.889.889 0 1 0-1.18 1.329l2 1.778c.36.32.909.295 1.238-.057l3.334-3.555a.889.889 0 1 0-1.297-1.216zm-4.981-6.503h5.926v.889c0 .49-.332.888-.741.888h-4.445c-.409 0-.74-.398-.74-.888v-.89z",
  className: "foreground-color",
  fill: white
})));
export default IconTaskGeneral;
//# sourceMappingURL=IconTaskGeneral.js.map