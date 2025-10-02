import * as React from 'react';
import Name from './Name';
export default (rootId, view, onItemClick, onItemSelect, canPreview = false, showDetails = true, isTouch = false) => ({
  rowData
}) => /*#__PURE__*/React.createElement(Name, {
  canPreview: canPreview,
  isTouch: isTouch,
  item: rowData,
  onItemClick: onItemClick,
  onItemSelect: onItemSelect,
  rootId: rootId,
  showDetails: showDetails,
  view: view
});
//# sourceMappingURL=nameCellRenderer.js.map