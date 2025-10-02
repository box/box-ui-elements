import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconFileBase = ({
  children,
  className = '',
  baseClassName,
  height = 32,
  title,
  width = 32
}) => {
  return /*#__PURE__*/React.createElement(AccessibleSVG, {
    className: `${baseClassName} ${className}`,
    height: height,
    title: title,
    viewBox: "0 0 32 32",
    width: width
  }, children);
};
export default IconFileBase;
//# sourceMappingURL=IconFileBase.js.map