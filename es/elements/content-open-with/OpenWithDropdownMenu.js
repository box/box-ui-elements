/**
 * 
 * @file Open With dropdown menu
 * @author Box
 */

import * as React from 'react';
import DropdownMenu from '../../components/dropdown-menu/DropdownMenu';
import Menu from '../../components/menu/Menu';
import OpenWithDropdownMenuItem from './OpenWithDropdownMenuItem';
import MultipleIntegrationsOpenWithButton from './MultipleIntegrationsOpenWithButton';
const RIGHT_ALIGNMENT = 'right';
const OpenWithDropdownMenu = ({
  dropdownAlignment = RIGHT_ALIGNMENT,
  integrations,
  onClick
}) => /*#__PURE__*/React.createElement(DropdownMenu, {
  isRightAligned: dropdownAlignment === RIGHT_ALIGNMENT
}, /*#__PURE__*/React.createElement(MultipleIntegrationsOpenWithButton, null), /*#__PURE__*/React.createElement(Menu, {
  className: "bcow-menu"
}, integrations.map(integration => /*#__PURE__*/React.createElement(OpenWithDropdownMenuItem, {
  key: integration.appIntegrationId,
  integration: integration,
  onClick: onClick
}))));
export default OpenWithDropdownMenu;
//# sourceMappingURL=OpenWithDropdownMenu.js.map