import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray65 } from '../../styles/variables';
const IconEdit = ({
  className = '',
  color = bdlGray65,
  height = 14,
  title,
  width = 14
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-edit ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M3.21 7.89l6.47-6.48a2 2 0 0 1 2.88 2.78h-.05L6 10.72 3.21 7.89zM2.24 9l2.83 2.83L1.67 13c-.52.18-.79-.1-.62-.61z",
  fill: color
}));
export default IconEdit;
//# sourceMappingURL=IconEdit.js.map