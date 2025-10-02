import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGreenLight } from '../../styles/variables';
const IconStorage = ({
  className = '',
  color = bdlGreenLight,
  height = 12,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconStorage ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 12",
  width: width
}, /*#__PURE__*/React.createElement("rect", {
  className: "background-color",
  clipRule: "evenodd",
  fill: "#D8D8D8",
  fillOpacity: "0",
  fillRule: "evenodd",
  height: "16",
  width: "16",
  y: "-2"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M12,1c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v10c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V1z M6,3c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1H7c-0.6,0-1-0.4-1-1V3z M0,7c0-0.6,0.4-1,1-1h2c0.6,0,1,0.4,1,1v4c0,0.6-0.4,1-1,1H1c-0.6,0-1-0.4-1-1V7z",
  fill: color
}));
export default IconStorage;
//# sourceMappingURL=IconStorage.js.map