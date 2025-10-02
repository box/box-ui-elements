import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const LockBadge = ({
  className = '',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `lock-badge ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "#ED3757",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  d: "M15 8c0-3.866-3.134-7-7-7S1 4.134 1 8s3.134 7 7 7 7-3.134 7-7zM0 8c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M6.5 5c0-.28.222-.5.51-.5h1.98c.285 0 .51.223.51.5v1c0 .277.224.5.5.5s.5-.223.5-.5V5c0-.832-.676-1.5-1.51-1.5H7.01c-.84 0-1.51.668-1.51 1.5v1c0 .276.224.5.5.5s.5-.224.5-.5V5zM5 11.002c0 .55.448.998.998.998h4.004c.556 0 .998-.443.998-.998V8.998c0-.55-.448-.998-.998-.998H5.998C5.442 8 5 8.443 5 8.998v2.004zM5.998 7h4.004C11.105 7 12 7.898 12 8.998v2.004C12 12.106 11.113 13 10.002 13H5.998C4.895 13 4 12.102 4 11.002V8.998C4 7.894 4.887 7 5.998 7z"
}), /*#__PURE__*/React.createElement("rect", {
  height: "1",
  rx: ".5",
  width: "2",
  x: "7",
  y: "9"
})));
export default LockBadge;
//# sourceMappingURL=LockBadge.js.map