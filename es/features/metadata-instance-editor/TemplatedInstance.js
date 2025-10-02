import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MetadataField from '../metadata-instance-fields/MetadataField';
import messages from './messages';
import { isHidden } from './metadataUtil';
import MetadataInstanceEditorContext from './MetadataInstanceEditorContext';
import './TemplatedInstance.scss';
const TemplatedInstance = ({
  canEdit,
  data = {},
  errors,
  isDisabled,
  onFieldChange,
  onFieldRemove,
  template
}) => {
  const {
    fields = []
  } = template;
  const hasFields = fields.length > 0;
  const hasVisibleFields = hasFields && fields.some(field => !isHidden(field));
  const showNoFieldsMessage = !hasFields;
  const showHiddenFieldsMessage = hasFields && !hasVisibleFields;
  const {
    blurExceptionClassNames
  } = React.useContext(MetadataInstanceEditorContext);
  return /*#__PURE__*/React.createElement(React.Fragment, null, hasVisibleFields && fields.map(field => /*#__PURE__*/React.createElement(MetadataField, {
    key: field.id,
    blurExceptionClassNames: blurExceptionClassNames,
    canEdit: canEdit,
    dataKey: field.key,
    dataValue: data[field.key],
    description: field.description,
    displayName: field.displayName,
    error: errors[field.key],
    isDisabled: isDisabled,
    isHidden: isHidden(field) // Checking both isHidden and hidden attributes due to differences in V2 and V3 APIs
    ,
    onChange: (key, value) => {
      if (canEdit && onFieldChange) {
        onFieldChange(key, value, field.type);
      }
    },
    onRemove: key => {
      if (canEdit && onFieldRemove) {
        onFieldRemove(key);
      }
    },
    options: field.options,
    type: field.type
  })), showHiddenFieldsMessage && /*#__PURE__*/React.createElement("div", {
    className: "attributes-hidden-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.allAttributesAreHidden)), showNoFieldsMessage && /*#__PURE__*/React.createElement("div", {
    className: "no-attributes-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.noAttributesForTemplate)));
};
export default TemplatedInstance;
//# sourceMappingURL=TemplatedInstance.js.map