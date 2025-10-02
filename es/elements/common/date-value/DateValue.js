import { useIntl } from 'react-intl';
import { isToday, isYesterday } from '../../../utils/datetime';
import { DEFAULT_DATE_FORMAT } from '../constants';
import defaultMessages from './messages';
const DateValue = ({
  date,
  format = DEFAULT_DATE_FORMAT,
  messages = {},
  isRelative = false
}) => {
  const {
    formatDate,
    formatMessage
  } = useIntl();
  const dateObject = new Date(date);
  const formattedDate = formatDate(dateObject, format);
  if (isRelative && isToday(dateObject)) {
    return formatMessage(messages.today ?? defaultMessages.today, {
      date: formattedDate
    });
  }
  if (isRelative && isYesterday(dateObject)) {
    return formatMessage(messages.yesterday ?? defaultMessages.yesterday, {
      date: formattedDate
    });
  }
  return messages.default ? formatMessage(messages.default, {
    date: formattedDate
  }) : formattedDate;
};
export default DateValue;
//# sourceMappingURL=DateValue.js.map