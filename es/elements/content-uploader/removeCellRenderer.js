import * as React from 'react';
import ItemRemove from './ItemRemove';
export default onClick => ({
  rowData
}) => {
  if (rowData.isFolder) {
    return null;
  }
  return /*#__PURE__*/React.createElement(ItemRemove, {
    status: rowData.status,
    onClick: () => onClick(rowData)
  });
};
//# sourceMappingURL=removeCellRenderer.js.map