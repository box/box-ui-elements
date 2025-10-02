import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Label from '../../components/label/Label';
import MultiSelect from '../../components/select-field/MultiSelectField';
import messages from './messages';
import './MultiSelectMetadataField.scss';
const MultiSelectMetadataField = ({
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
  const placeholder = /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataFieldMultiSelectValue);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-MultiSelectMetadataField"
  }, /*#__PURE__*/React.createElement(Label, {
    text: displayName
  }, !!description && /*#__PURE__*/React.createElement("i", {
    className: "bdl-MultiSelectMetadataField-desc"
  }, description), /*#__PURE__*/React.createElement(MultiSelect, {
    blurExceptionClassNames: blurExceptionClassNames,
    isDisabled: isDisabled,
    isEscapedWithReference: true,
    isScrollable: true,
    onChange: selectedOptions => {
      if (selectedOptions.length) {
        onChange(dataKey, selectedOptions.map(({
          value
        }) => value));
      } else {
        onRemove(dataKey);
      }
    },
    options: options.map(option => ({
      displayText: option.key,
      value: option.key
    })),
    placeholder: placeholder,
    selectedValues: dataValue
  })));
};
export { MultiSelectMetadataField as MultiSelectMetadataFieldBase };
export default MultiSelectMetadataField;
//# sourceMappingURL=MultiSelectMetadataField.js.map