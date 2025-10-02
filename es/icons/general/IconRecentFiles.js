import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconRecentFiles = ({
  className = '',
  color = '#999',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-recent-files ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M17 20l-3 2H5c-2 0-3-1-3-3V7l2-3v15l1 1h12z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8 0h7l1 1 4 4 1 1v10l-2 2H8l-2-2V2l2-2z",
  fill: color
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 5v5m4 0h-4",
  stroke: "#FFF",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2
}));
export default IconRecentFiles;
//# sourceMappingURL=IconRecentFiles.js.map