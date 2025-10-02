import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button, DropdownMenu } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../../common/sub-header/messages';
export const BulkItemActionMenu = ({
  actions,
  selectedItemIds
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(DropdownMenu.Root, null, /*#__PURE__*/React.createElement(DropdownMenu.Trigger, {
    className: "be-BulkItemActionMenu-trigger"
  }, /*#__PURE__*/React.createElement(Button, {
    role: "button",
    "aria-label": formatMessage(messages.bulkItemActionMenuAriaLabel),
    icon: Ellipsis,
    size: "large",
    variant: "secondary"
  })), /*#__PURE__*/React.createElement(DropdownMenu.Content, {
    align: "end"
  }, actions.map(({
    label,
    onClick
  }) => {
    return /*#__PURE__*/React.createElement(DropdownMenu.Item, {
      key: label,
      onSelect: () => onClick(selectedItemIds)
    }, label);
  })));
};
//# sourceMappingURL=BulkItemActionMenu.js.map