import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconUploadSolid = ({
  className = '',
  color = 'black',
  height = 24,
  title,
  width = 24
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-upload-solid ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 24 24",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z",
  fill: color
}));
export default IconUploadSolid;
//# sourceMappingURL=IconUploadSolid.js.map