import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const SharedLinkBadge = ({
  className = '',
  color = bdlBoxBlue,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `shared-link-badge ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M15 8c0-3.866-3.134-7-7-7S1 4.134 1 8s3.134 7 7 7 7-3.134 7-7zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M7.807 10.544c-.642.66-1.68.66-2.322 0-.65-.67-.65-1.765 0-2.434l.584-.6c.19-.2.186-.516-.012-.708-.198-.193-.514-.188-.707.01l-.582.6c-1.027 1.06-1.027 2.77 0 3.828 1.034 1.066 2.722 1.066 3.757 0l.583-.6c.192-.2.188-.515-.01-.708-.2-.192-.515-.187-.708.01l-.583.602zM8.126 5.39c.642-.662 1.68-.662 2.322 0 .65.67.65 1.764 0 2.433l-.584.6c-.192.2-.187.516.01.708.2.194.516.19.708-.01l.583-.6c1.027-1.057 1.027-2.77 0-3.827-1.034-1.066-2.72-1.066-3.756 0l-.585.6c-.192.2-.187.515.01.708.2.193.515.19.708-.01l.583-.6z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8.854 7.854c.195-.196.195-.512 0-.708-.196-.195-.512-.195-.708 0l-1 1c-.195.196-.195.512 0 .708.196.195.512.195.708 0l1-1z",
  fill: color
})));
export default SharedLinkBadge;
//# sourceMappingURL=SharedLinkBadge.js.map