function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import ItemAction from './ItemAction';
export default (isResumableUploadsEnabled, onClick, onUpgradeCTAClick) => ({
  rowData
}) => /*#__PURE__*/React.createElement(ItemAction, _extends({}, rowData, {
  isResumableUploadsEnabled: isResumableUploadsEnabled,
  onClick: () => onClick(rowData),
  onUpgradeCTAClick: onUpgradeCTAClick
}));
//# sourceMappingURL=actionCellRenderer.js.map