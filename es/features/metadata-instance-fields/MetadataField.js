import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import InlineError from '../../components/inline-error/InlineError';
import TextMetadataField from './TextMetadataField';
import EnumMetadataField from './EnumMetadataField';
import DateMetadataField from './DateMetadataField';
import FloatMetadataField from './FloatMetadataField';
import IntegerMetadataField from './IntegerMetadataField';
import MultiSelectMetadataField from './MultiSelectMetadataField';
import ReadOnlyMetadataField from './ReadOnlyMetadataField';
import messages from './messages';
import { FIELD_TYPE_ENUM, FIELD_TYPE_FLOAT, FIELD_TYPE_INTEGER, FIELD_TYPE_STRING, FIELD_TYPE_DATE, FIELD_TYPE_MULTISELECT, FIELD_TYPE_TAXONOMY } from './constants';
const MetadataField = ({
  blurExceptionClassNames,
  dataKey,
  dataValue,
  displayName,
  description,
  error,
  isDisabled,
  isHidden,
  canEdit,
  onChange,
  onRemove,
  options,
  type
}) => {
  if (isHidden) {
    return null;
  }
  if (!canEdit) {
    return /*#__PURE__*/React.createElement(ReadOnlyMetadataField, {
      dataValue: dataValue,
      description: description,
      displayName: displayName,
      type: type
    });
  }
  if (!onChange || !onRemove) {
    throw new Error('Need to have onChange and onRemove');
  }
  switch (type) {
    case FIELD_TYPE_STRING:
      return /*#__PURE__*/React.createElement(TextMetadataField, {
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove
      });
    case FIELD_TYPE_FLOAT:
      return /*#__PURE__*/React.createElement(FloatMetadataField, {
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        error: error,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove,
        type: type
      });
    case FIELD_TYPE_INTEGER:
      return /*#__PURE__*/React.createElement(IntegerMetadataField, {
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        error: error,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove,
        type: type
      });
    case FIELD_TYPE_ENUM:
      return /*#__PURE__*/React.createElement(EnumMetadataField, {
        blurExceptionClassNames: blurExceptionClassNames,
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove,
        options: options
      });
    case FIELD_TYPE_MULTISELECT:
      return /*#__PURE__*/React.createElement(MultiSelectMetadataField, {
        blurExceptionClassNames: blurExceptionClassNames,
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove,
        options: options
      });
    case FIELD_TYPE_DATE:
      return /*#__PURE__*/React.createElement(DateMetadataField, {
        dataKey: dataKey,
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        isDisabled: isDisabled,
        onChange: onChange,
        onRemove: onRemove
      });

    // The taxonomy field is a valid field type which,
    // although not yet supported here, should not trigger an error message.
    // For this reason, we are currently setting it to read-only.
    case FIELD_TYPE_TAXONOMY:
      return /*#__PURE__*/React.createElement(ReadOnlyMetadataField, {
        dataValue: dataValue,
        description: description,
        displayName: displayName,
        type: type
      });
    default:
      return /*#__PURE__*/React.createElement(InlineError, {
        title: type
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.invalidMetadataFieldType));
  }
};
export default MetadataField;
//# sourceMappingURL=MetadataField.js.map