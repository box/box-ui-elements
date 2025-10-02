import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';
const IconMoveCopy = ({
  className = '',
  color = bdlGray80,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-move-copy ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  fill: color,
  fillRule: "evenodd",
  d: "M4 3h9c.557 0 .942.345.994.875L14 4v11H4V3h9zm9 1H5v10h8V4zm-2-3v1H3v10H2V1h9zm-.5 9c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h3zm0-3c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h3z"
}));
export default IconMoveCopy;
//# sourceMappingURL=IconMoveCopy.js.map