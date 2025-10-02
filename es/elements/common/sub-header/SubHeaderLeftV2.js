import * as React from 'react';
import { useIntl } from 'react-intl';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { IconButton, PageHeader, Text } from '@box/blueprint-web';
import { useSelectedItemText } from '../../content-explorer/utils';
import messages from '../messages';
import './SubHeaderLeftV2.scss';
const SubHeaderLeftV2 = props => {
  const {
    currentCollection,
    onClearSelectedItemIds,
    rootName,
    selectedItemIds,
    title
  } = props;
  const {
    formatMessage
  } = useIntl();
  const selectedItemText = useSelectedItemText(currentCollection, selectedItemIds);

  // Case 1 and 2: selected item text with X button
  if (selectedItemText) {
    return /*#__PURE__*/React.createElement(PageHeader.Root, {
      className: "be-SubHeaderLeftV2--selection",
      variant: "default"
    }, /*#__PURE__*/React.createElement(PageHeader.Corner, null, /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": formatMessage(messages.clearSelection),
      icon: XMark,
      onClick: onClearSelectedItemIds,
      variant: "small-utility"
    })), /*#__PURE__*/React.createElement(PageHeader.StartElements, null, /*#__PURE__*/React.createElement(Text, {
      as: "span"
    }, selectedItemText)));
  }

  // Case 3: No selected items - show title if provided, otherwise show root name
  return /*#__PURE__*/React.createElement(Text, {
    as: "h1",
    variant: "titleXLarge"
  }, title ?? rootName);
};
export default SubHeaderLeftV2;
//# sourceMappingURL=SubHeaderLeftV2.js.map