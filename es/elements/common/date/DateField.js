// @deprecated, use DateValue component
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { isToday, isYesterday } from '../../../utils/datetime';
import messages from '../messages';
import './DateField.scss';
const DEFAULT_DATE_FORMAT = {
  weekday: 'short',
  month: 'short',
  year: 'numeric',
  day: 'numeric'
};
// This component has internationalization concerns, e.g. comma removal, capitalization
const DateField = ({
  date,
  dateFormat = DEFAULT_DATE_FORMAT,
  omitCommas = false,
  relative = true,
  capitalize = false
}) => {
  const {
    formatDate
  } = useIntl();
  const d = new Date(date);
  const isTodaysDate = isToday(d);
  const isYesterdaysDate = isYesterday(d);
  if (relative && (isTodaysDate || isYesterdaysDate)) {
    let Message = /*#__PURE__*/React.createElement(FormattedMessage, messages.today);
    if (isYesterdaysDate) {
      Message = /*#__PURE__*/React.createElement(FormattedMessage, messages.yesterday);
    }
    if (capitalize) {
      return /*#__PURE__*/React.createElement("span", {
        className: "be-date-capitalize"
      }, Message);
    }
    return Message;
  }
  let formattedDate = formatDate(d, dateFormat);
  formattedDate = omitCommas ? formattedDate.replace(/,/g, '') : formattedDate;
  return formattedDate;
};
export default DateField;
//# sourceMappingURL=DateField.js.map