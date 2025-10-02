import * as React from 'react';
import TextMetadataField from './TextMetadataField';
import { isValidValue } from './validateMetadataField';
const FloatMetadataField = ({
  dataKey,
  dataValue,
  displayName,
  description,
  error,
  isDisabled,
  onChange,
  onRemove,
  type
}) => /*#__PURE__*/React.createElement(TextMetadataField, {
  dataKey: dataKey,
  dataValue: dataValue,
  description: description,
  displayName: displayName,
  error: error,
  isDisabled: isDisabled,
  onChange: (key, value) => {
    if (isValidValue(type, value)) {
      onChange(key, value);
    }
  },
  onRemove: onRemove
});
export default FloatMetadataField;
//# sourceMappingURL=FloatMetadataField.js.map