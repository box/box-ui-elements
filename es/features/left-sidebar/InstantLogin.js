import * as React from 'react';
import LeftSidebarLink from './LeftSidebarLink';
import LeftSidebarIconWrapper from './LeftSidebarIconWrapper';
import './styles/InstantLogin.scss';
const InstantLogin = ({
  htmlAttributes = {},
  iconComponent: Icon,
  message = '',
  showTooltip = false
}) => /*#__PURE__*/React.createElement(LeftSidebarLink, {
  className: "instant-login-link",
  htmlAttributes: htmlAttributes,
  icon: Icon ? /*#__PURE__*/React.createElement(LeftSidebarIconWrapper, null, /*#__PURE__*/React.createElement(Icon, null)) : null,
  message: message,
  showTooltip: showTooltip
});
export default InstantLogin;
//# sourceMappingURL=InstantLogin.js.map