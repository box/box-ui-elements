import React from 'react';
import { useIntl } from 'react-intl';
import DateValue from '../date-value';
import { VIEW_RECENTS } from '../../../constants';
import messages from './messages';
const ItemDate = ({
  isSmall,
  item,
  view
}) => {
  const {
    interacted_at: interactedAt,
    modified_at: modifiedAt,
    modified_by: modifiedBy
  } = item;
  const {
    formatMessage
  } = useIntl();
  if (view === VIEW_RECENTS) {
    return /*#__PURE__*/React.createElement(DateValue, {
      date: interactedAt || modifiedAt,
      isRelative: true,
      messages: {
        default: messages.viewedDate,
        today: messages.viewedToday,
        yesterday: messages.viewedYesterday
      }
    });
  }
  if (!isSmall && modifiedBy?.name) {
    return formatMessage(messages.modifiedDateBy, {
      date: /*#__PURE__*/React.createElement(DateValue, {
        date: modifiedAt,
        isRelative: true
      }),
      name: modifiedBy.name
    });
  }
  return /*#__PURE__*/React.createElement(DateValue, {
    date: modifiedAt,
    isRelative: true
  });
};
export default ItemDate;
//# sourceMappingURL=ItemDate.js.map