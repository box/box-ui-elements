import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconListView = ({
  className = '',
  color = '#222',
  height = 9,
  opacity = 1,
  title,
  width = 9
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-list-view ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 9 9",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M0 5h9V4H0v1zm0 4h9V8H0v1zm0-9v1h9V0H0z",
  fill: color,
  fillOpacity: opacity,
  fillRule: "evenodd"
}));
export default IconListView;
//# sourceMappingURL=IconListView.js.map