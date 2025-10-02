import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconPencilSolid = ({
  className = '',
  color = '#000000',
  height = 10,
  title,
  width = 10
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-pencil-solid ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 10 10",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M.5 7.625V9.5h1.875l5.53-5.53-1.876-1.874L.5 7.626zM9.354 2.52c.195-.194.195-.51 0-.704L8.184.646C7.99.45 7.674.45 7.48.646l-.916.915L8.44 3.437l.914-.915z",
  fill: color
}));
export default IconPencilSolid;
//# sourceMappingURL=IconPencilSolid.js.map