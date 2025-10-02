import * as React from 'react';
import { useIntl } from 'react-intl';
import TextInput from '../../components/text-input';
import messages from './messages';
import './TextMetadataField.scss';
const TextMetadataField = ({
  dataKey,
  dataValue,
  displayName,
  description,
  error,
  isDisabled,
  onChange,
  onRemove,
  type = 'text'
}) => {
  const {
    formatMessage
  } = useIntl();
  let value = '';
  if (typeof dataValue === 'number') {
    value = dataValue;
  } else if (dataValue) {
    value = dataValue;
  }
  return /*#__PURE__*/React.createElement(TextInput, {
    className: "bdl-TextMetadataField",
    description: description,
    error: error,
    hideOptionalLabel: true,
    disabled: isDisabled,
    label: displayName,
    name: dataKey,
    onChange: event => {
      const currentTarget = event.currentTarget;
      if (currentTarget.value) {
        onChange(dataKey, currentTarget.value);
      } else {
        onRemove(dataKey);
      }
    },
    placeholder: formatMessage(messages.metadataFieldSetValue),
    type: type,
    value: value
  });
};
export default TextMetadataField;
//# sourceMappingURL=TextMetadataField.js.map