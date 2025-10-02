import * as React from 'react';
import { bdlGray80 } from '../../styles/variables';
import AccessibleSVG from '../accessible-svg';
const IconDrawAnnotationMode = ({
  className = '',
  color = bdlGray80,
  height = 21,
  title,
  width = 22
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-annotation-draw ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 14.88 14.88",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M11.65,6.64,5.11,13.17.06,14.94,1.83,9.89,8.37,3.35Zm1.41-1.41L9.78,1.94,11.37.35a1,1,0,0,1,1.41,0l1.87,1.87a1,1,0,0,1,0,1.41Z",
  fill: color,
  fillRule: "evenodd"
}));
export default IconDrawAnnotationMode;
//# sourceMappingURL=IconDrawAnnotation.js.map