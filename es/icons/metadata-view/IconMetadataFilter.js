import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconMetadataFilter = ({
  className = '',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `metadata-filter ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  d: "M7 11h2v2H7v-2zM1 3h14v2H1V3zm3 4h8v2H4V7z",
  fill: "#444",
  fillRule: "nonzero"
}));
export default IconMetadataFilter;
//# sourceMappingURL=IconMetadataFilter.js.map