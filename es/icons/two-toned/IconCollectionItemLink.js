import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray, white } from '../../styles/variables';
const IconCollectionItemLink = ({
  className = '',
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconCollectionItemLink ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 32 32",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "background-color",
  fill: bdlGray,
  d: "M0 16C0 7.138 7.138 0 16 0s16 7.138 16 16-7.138 16-16 16S0 24.862 0 16z"
}), /*#__PURE__*/React.createElement("path", {
  className: "foreground-color",
  fill: white,
  fillRule: "nonzero",
  d: "M18.111 12.07H13.66c-.68 0-1.232-.544-1.232-1.215s.551-1.215 1.232-1.215h7.39c.681 0 1.232.544 1.232 1.215v7.29c0 .671-.551 1.215-1.231 1.215s-1.232-.544-1.232-1.215v-4.321l-8.076 8.102a1.244 1.244 0 0 1-1.742 0 1.203 1.203 0 0 1 0-1.719l8.111-8.137z"
}));
export default IconCollectionItemLink;
//# sourceMappingURL=IconCollectionItemLink.js.map