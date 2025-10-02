import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Plus } from '@box/blueprint-web-assets/icons/Fill';
import messages from '../messages';
const Add = ({
  isDisabled,
  onUpload,
  onCreate,
  portalElement,
  showCreate = true,
  showUpload = true
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(DropdownMenu.Root, null, /*#__PURE__*/React.createElement(DropdownMenu.Trigger, null, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.add),
    className: "be-btn-add",
    disabled: isDisabled,
    icon: Plus
  })), /*#__PURE__*/React.createElement(DropdownMenu.Content, {
    container: portalElement
  }, showUpload && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: onUpload
  }, formatMessage(messages.upload)), showCreate && /*#__PURE__*/React.createElement(DropdownMenu.Item, {
    onClick: onCreate
  }, formatMessage(messages.newFolder))));
};
export default Add;
//# sourceMappingURL=Add.js.map