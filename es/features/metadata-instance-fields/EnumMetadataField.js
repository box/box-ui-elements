import * as React from 'react';
import { useIntl } from 'react-intl';
import Label from '../../components/label/Label';
import SingleSelectField from '../../components/select-field/SingleSelectField';
import messages from './messages';
import './EnumMetadataField.scss';
const EnumMetadataField = ({
  blurExceptionClassNames,
  dataKey,
  dataValue,
  displayName,
  description,
  isDisabled,
  onChange,
  onRemove,
  options = []
}) => {
  const selectOptions = options.map(option => ({
    displayText: option.key,
    value: option.key,
    isSelectable: true
  }));
  const {
    formatMessage
  } = useIntl();
  const defaultValue = formatMessage(messages.metadataFieldSelectValue);
  selectOptions.unshift({
    displayText: defaultValue,
    value: defaultValue,
    isSelectable: false
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-EnumMetadataField"
  }, /*#__PURE__*/React.createElement(Label, {
    text: displayName
  }, !!description && /*#__PURE__*/React.createElement("i", {
    className: "bdl-EnumMetadataField-desc"
  }, description), /*#__PURE__*/React.createElement(SingleSelectField, {
    blurExceptionClassNames: blurExceptionClassNames,
    isEscapedWithReference: true,
    isDisabled: isDisabled,
    isScrollable: true,
    onChange: option => {
      if (option.isSelectable) {
        onChange(dataKey, option.value);
      } else if (onRemove) {
        onRemove(dataKey);
      }
    },
    options: selectOptions,
    selectedValue:
    // Conditional to make flow happy, dataValue should never be an array
    Array.isArray(dataValue) ? dataValue.join(', ') : dataValue || defaultValue
  })));
};
export default EnumMetadataField;
//# sourceMappingURL=EnumMetadataField.js.map