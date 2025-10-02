function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Custom message to install Box Tools inside of Open With.
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from '../common/messages';
import './BoxToolsInstallMessage.scss';
const DEFAULT_BOX_TOOLS_INSTALLATION_URL = 'https://cloud.box.com/v/installboxtools';
const DEFAULT_BOX_TOOLS_NAME = 'Box Tools';
const BoxToolsInstallMessage = ({
  boxToolsName = DEFAULT_BOX_TOOLS_NAME,
  boxToolsInstallUrl = DEFAULT_BOX_TOOLS_INSTALLATION_URL
}) => {
  const onLinkClick = () => {
    // Manually open the URL since disabled menu items are blocked from clickable actions by default
    window.open(boxToolsInstallUrl);
  };
  return /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.boxToolsInstallMessage, {
    values: {
      boxTools:
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      React.createElement("a", {
        href: "#",
        onClick: onLinkClick,
        rel: "noopener noreferrer"
      }, boxToolsName)
    }
  }));
};
export default BoxToolsInstallMessage;
//# sourceMappingURL=BoxToolsInstallMessage.js.map