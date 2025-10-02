import * as React from 'react';
import { bdlGray50 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconShow = ({
  className = '',
  color = bdlGray50,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-show ${className}`,
  title: title,
  width: width,
  height: height,
  viewBox: "0 0 16 16"
}, /*#__PURE__*/React.createElement("path", {
  d: "M7.354 7.646l3.292-3.292a.5.5 0 0 0 0-.708L9.354 2.354a.5.5 0 0 0-.708 0L3.354 7.646a.5.5 0 0 0 0 .708l5.292 5.292a.5.5 0 0 0 .708 0l1.292-1.292a.5.5 0 0 0 0-.708L7.354 8.354a.5.5 0 0 1 0-.708z",
  fill: color,
  fillRule: "nonzero"
}));
export default IconShow;
//# sourceMappingURL=IconShow.js.map