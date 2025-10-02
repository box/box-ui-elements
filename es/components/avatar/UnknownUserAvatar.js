import * as React from 'react';
import AccessibleSVG from '../accessible-svg/AccessibleSVG';
import * as vars from '../../styles/variables';
const UnknownUserAvatar = ({
  className = '',
  height = 28,
  title,
  width = 28
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `unknown-user-avatar ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  fill: vars.bdlGray50,
  fillRule: "evenodd",
  d: "M8 0a8 8 0 110 16A8 8 0 018 0zm0 9.5c-1.21 0-2.293.413-3.232 1.096-.56.407-.953.817-1.168 1.104a.5.5 0 00.8.6c.035-.047.114-.141.234-.267.205-.214.447-.428.722-.629.78-.567 1.665-.904 2.644-.904.979 0 1.865.337 2.644.904.275.2.517.415.722.63.12.125.199.219.234.266a.5.5 0 00.8-.6c-.215-.287-.607-.697-1.168-1.104C10.293 9.913 9.21 9.5 8 9.5zm0-6a2.5 2.5 0 000 5 2.5 2.5 0 000-5zm0 1a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 4.5z"
}));
export default UnknownUserAvatar;
//# sourceMappingURL=UnknownUserAvatar.js.map