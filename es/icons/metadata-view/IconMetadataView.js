import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray65 } from '../../styles/variables';
const IconMetadataView = ({
  className = '',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `metadata-view ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  d: "M8.83 9a2.995 2.995 0 0 0 0-2H15a1 1 0 0 1 0 2H8.83zM3.17 9H1a1 1 0 0 1 0-2h2.17a2.995 2.995 0 0 0 0 2zm10.66-6a2.995 2.995 0 0 0 0-2H15a1 1 0 0 1 0 2h-1.17zM8.17 3H1a1 1 0 1 1 0-2h7.17a2.995 2.995 0 0 0 0 2zM9 2a2 2 0 1 1 4 0 2 2 0 0 1-4 0zM4 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z",
  fill: bdlGray65,
  fillRule: "nonzero"
})));
export default IconMetadataView;
//# sourceMappingURL=IconMetadataView.js.map