import * as React from 'react';
import './ButtonGroup.scss';
const ButtonGroup = ({
  children,
  className = '',
  isDisabled
}) => /*#__PURE__*/React.createElement("div", {
  className: `btn-group ${className} ${isDisabled ? 'is-disabled' : ''}`
}, children);
export default ButtonGroup;
//# sourceMappingURL=ButtonGroup.js.map