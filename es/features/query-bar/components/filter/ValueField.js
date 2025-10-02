import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import isNaN from 'lodash/isNaN';
import DatePicker from '../../../../components/date-picker';
import SingleSelectField from '../../../../components/select-field/SingleSelectField';
import MultiSelectField from '../../../../components/select-field/MultiSelectField';
import TextInput from '../../../../components/text-input';
import { DATE, ENUM, FLOAT, MULTI_SELECT, NUMBER, STRING, VALUE } from '../../constants';
import messages from '../../messages';
import '../../styles/Condition.scss';
const getDateValue = selectedValues => {
  if (selectedValues.length === 0 || selectedValues[0] === null) {
    return undefined;
  }
  const value = selectedValues[0];
  const date = new Date(value);
  if (!isNaN(date.valueOf())) {
    return date;
  }
  throw new Error('Expected Date');
};
const getStringValue = selectedValues => {
  if (selectedValues.length === 0) {
    return undefined;
  }
  const value = selectedValues[0];
  if (typeof value === 'string') {
    return value !== '' ? value : null;
  }
  throw new Error('Expected string');
};
const ValueField = ({
  error,
  onChange,
  selectedValues,
  valueOptions,
  valueType
}) => {
  const value = selectedValues.length > 0 ? selectedValues[0] : '';
  const onInputChange = e => {
    return e.target.value !== '' ? onChange([e.target.value]) : onChange([]);
  };
  switch (valueType) {
    case STRING:
    case NUMBER:
    case FLOAT:
      return /*#__PURE__*/React.createElement("div", {
        className: "filter-dropdown-text-field-container"
      }, /*#__PURE__*/React.createElement(TextInput, {
        error: error,
        errorPosition: "middle-left",
        hideLabel: true,
        label: "Text Input",
        name: "text",
        onChange: onInputChange,
        placeholder: `Enter ${valueType === STRING ? 'value' : 'a number'}`,
        value: value
      }));
    case DATE:
      return /*#__PURE__*/React.createElement("div", {
        className: "filter-dropdown-date-field-container"
      }, /*#__PURE__*/React.createElement(DatePicker, {
        displayFormat: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        },
        hideLabel: true,
        label: "Date",
        name: "datepicker",
        onChange: date => onChange([date]),
        placeholder: "Date",
        value: getDateValue(selectedValues)
      }));
    case ENUM:
      return /*#__PURE__*/React.createElement(SingleSelectField, {
        fieldType: VALUE,
        onChange: e => onChange([e.value]),
        options: valueOptions,
        placeholder: /*#__PURE__*/React.createElement(FormattedMessage, messages.selectValuePlaceholderText),
        selectedValue: getStringValue(selectedValues)
      });
    case MULTI_SELECT:
      return /*#__PURE__*/React.createElement(MultiSelectField, {
        fieldType: VALUE,
        onChange: e => onChange(e.map(option => option.value)),
        options: valueOptions,
        placeholder: /*#__PURE__*/React.createElement(FormattedMessage, messages.selectValuePlaceholderText),
        selectedValues: selectedValues
      });
    default:
      return null;
  }
};
export default ValueField;
//# sourceMappingURL=ValueField.js.map