import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconHome = ({
  className = '',
  color = '#000000',
  height = 18,
  title,
  width = 20
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-home ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 20 18",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M8 17.5v-6h4v6h5v-8h3l-10-9-10 9h3v8h5z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconHome;
//# sourceMappingURL=IconHome.js.map