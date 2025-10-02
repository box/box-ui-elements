import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconExpand = ({
  className = '',
  color = '#979797',
  height = 13,
  title,
  width = 13
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-expand ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 13 13",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M12 0H6a1 1 0 0 0 0 2h5v5a1 1 0 0 0 2 0V1a1 1 0 0 0-1-1zM7 11H2V6a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1h6a1 1 0 0 0 0-2z",
  fill: color
}));
export default IconExpand;
//# sourceMappingURL=IconExpand.js.map