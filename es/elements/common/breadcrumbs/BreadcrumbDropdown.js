import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../messages';
const BreadcrumbDropdown = ({
  crumbs,
  onCrumbClick,
  portalElement
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(DropdownMenu.Root, null, /*#__PURE__*/React.createElement(DropdownMenu.Trigger, null, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.breadcrumbLabel),
    icon: Ellipsis
  })), /*#__PURE__*/React.createElement(DropdownMenu.Content, {
    container: portalElement
  }, crumbs.map(({
    id,
    name
  }) => /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    key: id,
    onClick: () => onCrumbClick(id)
  }, name))));
};
export default BreadcrumbDropdown;
//# sourceMappingURL=BreadcrumbDropdown.js.map