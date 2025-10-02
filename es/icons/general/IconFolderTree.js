import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray50 } from '../../styles/variables';
const IconFolderTree = ({
  className = '',
  color = bdlGray50,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `bdl-IconFolderTree ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M4 1a2 2 0 0 1 .501 3.937L4.5 7h5.563a2 2 0 1 1 0 1.001L4.5 8v4.5h5.563a2 2 0 1 1 0 1.001L3.5 13.5V4.937A2 2 0 0 1 4 1z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconFolderTree;
//# sourceMappingURL=IconFolderTree.js.map