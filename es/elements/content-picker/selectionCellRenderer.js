/**
 * 
 * @file Function to render the checkbox or radio table cell
 * @author Box
 */

import * as React from 'react';
import Checkbox from '../../components/checkbox';
import RadioButton from '../../components/radio/RadioButton';
import isRowSelectable from './cellRendererHelper';
export default (onItemSelect, selectableType, extensionsWhitelist, hasHitSelectionLimit, isRadio) => ({
  rowData
}) => {
  const {
    name = '',
    selected = false
  } = rowData;
  const Component = isRadio ? RadioButton : Checkbox;
  if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
    return /*#__PURE__*/React.createElement("span", null);
  }
  return /*#__PURE__*/React.createElement(Component, {
    hideLabel: true,
    label: name,
    name: name,
    onChange: () => onItemSelect(rowData),
    value: name,
    [isRadio ? 'isSelected' : 'isChecked']: selected
  });
};
//# sourceMappingURL=selectionCellRenderer.js.map