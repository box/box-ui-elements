import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';
const IconLogin = ({
  className = '',
  color = bdlGray80,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconLogin ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  fill: color,
  d: "M12,3H4C3.4,3,3,3.4,3,4v8c0,0.6,0.4,1,1,1h8c0.6,0,1-0.4,1-1V4C13,3.4,12.6,3,12,3z M12,2c1.1,0,2,0.9,2,2v8c0,1.1-0.9,2-2,2H4c-1.1,0-2-0.9-2-2V4c0-1.1,0.9-2,2-2H12z M8.1,3.9l4.2,4.2l-4.2,4.2l-0.7-0.7l3-3l-6.6,0v-1l6.6,0l-3-3L8.1,3.9z"
}));
export default IconLogin;
//# sourceMappingURL=IconLogin.js.map