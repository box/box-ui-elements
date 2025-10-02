import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray } from '../../styles/variables';
const IconPublic = ({
  className = '',
  color = bdlGray,
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconPublic ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M18.831 17.55c-.001-.008-.003-.014-.006-.016l.016.024zm.053.077a8.634 8.634 0 0 1 1.316 4.659V26h10.798v-3.404c.074-3.654-2.706-6.767-6.39-7.17a7.076 7.076 0 0 0-5.724 2.2zM24 11.857c1.66 0 3-1.315 3-2.928C27 7.315 25.66 6 24 6s-3 1.315-3 2.929c0 1.613 1.34 2.928 3 2.928zm-15.998 0c1.66 0 3-1.315 3-2.928C11 7.315 9.66 6 8 6S5 7.315 5 8.929c0 1.613 1.34 2.928 3 2.928zm-.675 3.566c-3.672.457-6.396 3.553-6.324 7.193V26H15v-3.72a6.794 6.794 0 0 0-2.28-5.096 7.091 7.091 0 0 0-5.394-1.761z",
  stroke: color,
  strokeWidth: 2,
  fill: "none"
}));
export default IconPublic;
//# sourceMappingURL=IconPublic.js.map