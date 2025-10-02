import * as React from 'react';
import IconCell from './IconCell';
export default (dimension = 32) => ({
  rowData
}) => /*#__PURE__*/React.createElement("div", {
  className: "be-item-icon"
}, /*#__PURE__*/React.createElement(IconCell, {
  rowData: rowData,
  dimension: dimension
}));
//# sourceMappingURL=iconCellRenderer.js.map