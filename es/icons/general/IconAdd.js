import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';
const IconAdd = ({
  className = '',
  color = bdlGray80,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconAdd ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8.5 2v5.5H14v1H8.5V14h-1V8.5H2v-1h5.5V2z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconAdd;
//# sourceMappingURL=IconAdd.js.map