import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BoxLogo } from '@box/blueprint-web-assets/icons/Logo';
import messages from '../messages';
import './Logo.scss';
function getLogo(url) {
  if (url === 'box') {
    return /*#__PURE__*/React.createElement(BoxLogo, {
      height: 25,
      width: 45
    });
  }
  if (typeof url === 'string') {
    return /*#__PURE__*/React.createElement("img", {
      alt: "",
      className: "be-logo-custom",
      src: url
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "be-logo-placeholder"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.logo));
}
const Logo = ({
  url
}) => /*#__PURE__*/React.createElement("div", {
  className: "be-logo",
  "data-testid": "be-Logo"
}, getLogo(url));
export default Logo;
//# sourceMappingURL=Logo.js.map