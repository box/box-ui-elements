import * as React from 'react';
import { bdlGray20 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconSmallClose = ({
  className = '',
  color = bdlGray20,
  height = 8,
  title,
  width = 8
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-close ${className}`,
  height: height,
  title: title,
  viewBox: "181 11 8 8",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M189 11.806l-.806-.806L185 14.194 181.806 11l-.806.806L184.194 15 181 18.194l.806.806L185 15.806 188.194 19l.806-.806L185.806 15",
  fill: color
}));
export default IconSmallClose;
//# sourceMappingURL=IconSmallClose.js.map