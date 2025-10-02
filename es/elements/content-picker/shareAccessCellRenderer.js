/**
 * 
 * @file Function to render the share access table cell
 * @author Box
 */

import * as React from 'react';
import getProp from 'lodash/get';
import ShareAccessSelect from '../common/share-access-select';
import isRowSelectable from './cellRendererHelper';
import LoadingIndicator from '../../components/loading-indicator';
export default (onChange, canSetShareAccess, selectableType, extensionsWhitelist, hasHitSelectionLimit) => ({
  rowData
}) => {
  const itemCanSetShareAccess = getProp(rowData, 'permissions.can_set_share_access', false);
  if (!canSetShareAccess || !itemCanSetShareAccess || !isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) || !rowData.selected) {
    return /*#__PURE__*/React.createElement("span", null);
  }
  const {
    allowed_shared_link_access_levels
  } = rowData;
  const isLoading = !allowed_shared_link_access_levels;
  return isLoading ? /*#__PURE__*/React.createElement(LoadingIndicator, {
    className: "bcp-share-access-loading"
  }) : /*#__PURE__*/React.createElement(ShareAccessSelect, {
    canSetShareAccess: canSetShareAccess,
    className: "bcp-shared-access-select",
    item: rowData,
    onChange: onChange
  });
};
//# sourceMappingURL=shareAccessCellRenderer.js.map