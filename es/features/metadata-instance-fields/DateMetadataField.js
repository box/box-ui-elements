import * as React from 'react';
import { useIntl } from 'react-intl';
import DatePicker from '../../components/date-picker';
import { convertISOStringToUTCDate } from '../../utils/datetime';
import messages from './messages';
import './DateMetadataField.scss';
const DateMetadataField = ({
  dataKey,
  dataValue,
  displayName,
  description,
  isDisabled,
  onChange,
  onRemove
}) => {
  const {
    formatMessage
  } = useIntl();
  return /*#__PURE__*/React.createElement(DatePicker, {
    className: "bdl-DateMetadataField",
    dateFormat: "utcISOString",
    description: description,
    displayFormat: {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    },
    hideOptionalLabel: true,
    isDisabled: isDisabled,
    label: displayName,
    onChange: (date, isoDate) => {
      if (isoDate) {
        onChange(dataKey, isoDate);
      } else {
        onRemove(dataKey);
      }
    },
    placeholder: formatMessage(messages.metadataFieldSetDate),
    value: typeof dataValue === 'string' ? convertISOStringToUTCDate(dataValue) : undefined
  });
};
export default DateMetadataField;
//# sourceMappingURL=DateMetadataField.js.map