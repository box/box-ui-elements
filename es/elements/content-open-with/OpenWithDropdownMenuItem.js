/**
 * 
 * @file Open With dropdown menu item
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import MenuItem from '../../components/menu/MenuItem';
import messages from '../common/messages';
import { OPEN_WITH_MENU_ITEM_ICON_SIZE } from '../../constants';
import getIcon from './IconFileMap';
import utils from './openWithUtils';
import './OpenWithDropdownMenuItem.scss';
function getErrorMessage(disabledReasons = []) {
  let message;
  // Use the first disabled reason as the description if the integration is disabled.
  const code = disabledReasons[0];
  const defaultErrorMessage = /*#__PURE__*/React.createElement(FormattedMessage, messages.errorOpenWithDescription);
  switch (code) {
    case 'blocked_by_shield_access_policy':
      message = /*#__PURE__*/React.createElement(FormattedMessage, messages.boxEditErrorBlockedByPolicy);
      break;
    case 'collaborators_hidden':
      message = defaultErrorMessage;
      break;
    default:
      message = disabledReasons[0] || defaultErrorMessage;
  }
  return message;
}
const OpenWithDropdownMenuItem = ({
  integration,
  onClick
}) => {
  const {
    displayName,
    displayDescription,
    isDisabled,
    extension,
    disabledReasons
  } = integration;
  const Icon = getIcon(displayName);
  const description = isDisabled ? getErrorMessage(disabledReasons) : displayDescription;
  const className = classNames({
    'bcow-box-tools-uninstalled': utils.isDisabledBecauseBoxToolsIsNotInstalled(integration)
  });
  return /*#__PURE__*/React.createElement(MenuItem, {
    className: className,
    isDisabled: isDisabled,
    onClick: () => onClick(integration)
  }, /*#__PURE__*/React.createElement(Icon, {
    dimension: OPEN_WITH_MENU_ITEM_ICON_SIZE,
    extension: extension,
    height: OPEN_WITH_MENU_ITEM_ICON_SIZE,
    width: OPEN_WITH_MENU_ITEM_ICON_SIZE
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("p", {
    className: "bcow-menu-item-title"
  }, displayName), /*#__PURE__*/React.createElement("p", {
    className: "bcow-menu-item-description"
  }, description)));
};
export default OpenWithDropdownMenuItem;
//# sourceMappingURL=OpenWithDropdownMenuItem.js.map