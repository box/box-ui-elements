import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import IconLogo from '../../icons/general/IconLogo';
const Logo = ({
  color = bdlBoxBlue,
  height = 25,
  width = 45,
  title
}) => /*#__PURE__*/React.createElement("div", {
  className: "logo"
}, /*#__PURE__*/React.createElement(IconLogo, {
  color: color,
  height: height,
  title: title,
  width: width
}));
export default Logo;
//# sourceMappingURL=Logo.js.map