import * as React from 'react';
import { injectIntl } from 'react-intl';
import Button from '../../components/button/Button';
import ButtonGroup from '../../components/button-group/ButtonGroup';
import IconMinus from '../../icons/general/IconMinusThin';
import IconPlus from '../../icons/general/IconPlusThin';
import Field from './MetadataField';
import messages from './messages';
import './CustomMetadataField.scss';
const COLOR_999 = '#999';
const CustomMetadataField = ({
  intl,
  canEdit,
  isLast,
  dataKey,
  dataValue,
  onAdd,
  onChange,
  onRemove
}) => {
  const addBtn = /*#__PURE__*/React.createElement(Button, {
    "aria-label": intl.formatMessage(messages.customAdd),
    "data-resin-target": "metadata-customfieldnew",
    onClick: onAdd,
    type: "button"
  }, /*#__PURE__*/React.createElement(IconPlus, {
    color: COLOR_999
  }));
  const removeBtn = /*#__PURE__*/React.createElement(Button, {
    "aria-label": intl.formatMessage(messages.customRemove),
    "data-resin-target": "metadata-customfieldremove",
    onClick: () => {
      if (onRemove) {
        onRemove(dataKey);
      }
    },
    type: "button"
  }, /*#__PURE__*/React.createElement(IconMinus, {
    color: COLOR_999
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-CustomMetadataField"
  }, /*#__PURE__*/React.createElement(Field, {
    canEdit: canEdit,
    dataKey: dataKey,
    dataValue: dataValue,
    displayName: dataKey,
    onChange: onChange
    // Custom metadata doesn't allow removing of props if the value is emptied out, leave it as empty string
    ,
    onRemove: key => onChange(key, ''),
    type: "string"
  }), canEdit && /*#__PURE__*/React.createElement("div", {
    className: "bdl-CustomMetadataField-customActions"
  }, isLast ? /*#__PURE__*/React.createElement(ButtonGroup, null, removeBtn, addBtn) : removeBtn));
};
export { CustomMetadataField as CustomMetadataFieldBase };
export default injectIntl(CustomMetadataField);
//# sourceMappingURL=CustomMetadataField.js.map