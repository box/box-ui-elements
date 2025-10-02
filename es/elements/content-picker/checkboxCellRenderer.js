/**
 * 
 * @file Function to render the checkbox table cell
 * @author Box
 */

import * as React from 'react';
import Checkbox from '../../components/checkbox/Checkbox';
import isRowSelectable from './cellRendererHelper';
export default (onItemSelect, selectableType, extensionsWhitelist, hasHitSelectionLimit) => ({
  rowData
}) => {
  const {
    name,
    selected = false
  } = rowData;
  if (!isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData)) {
    return /*#__PURE__*/React.createElement("span", null);
  }
  return /*#__PURE__*/React.createElement(Checkbox, {
    hideLabel: true,
    isChecked: selected,
    label: name,
    name: name,
    onChange: () => onItemSelect(rowData)
  });
};
//# sourceMappingURL=checkboxCellRenderer.js.map