import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import IconSort from '../../../icons/general/IconSort';
import { FIELD_NAME, FIELD_DATE, FIELD_SIZE, SORT_ASC, SORT_DESC } from '../../../constants';
import messages from '../messages';
const SORT_ITEMS = [[FIELD_NAME, SORT_ASC], [FIELD_NAME, SORT_DESC], [FIELD_DATE, SORT_ASC], [FIELD_DATE, SORT_DESC], [FIELD_SIZE, SORT_ASC], [FIELD_SIZE, SORT_DESC]];
const Sort = ({
  onSortChange,
  portalElement
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(DropdownMenu.Root, null, /*#__PURE__*/React.createElement(DropdownMenu.Trigger, null, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": formatMessage(messages.sort),
    className: "be-btn-sort",
    icon: IconSort
  })), /*#__PURE__*/React.createElement(DropdownMenu.Content, {
    container: portalElement
  }, SORT_ITEMS.map(([sortByValue, sortDirectionValue]) => {
    const sortItemKey = `${sortByValue}${sortDirectionValue}`;
    return /*#__PURE__*/React.createElement(DropdownMenu.Item, {
      key: sortItemKey,
      onClick: () => onSortChange(sortByValue, sortDirectionValue)
    }, formatMessage(messages[sortItemKey]));
  })));
};
export default Sort;
//# sourceMappingURL=Sort.js.map