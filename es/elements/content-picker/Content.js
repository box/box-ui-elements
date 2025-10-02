/**
 * 
 * @file File picker header and list component
 * @author Box
 */

import * as React from 'react';
// $FlowFixMe TypeScript file
import EmptyView from '../common/empty-view';
import ProgressBar from '../common/progress-bar';
import ItemList from './ItemList';
import { VIEW_ERROR, VIEW_SELECTED } from '../../constants';

// $FlowFixMe TypeScript file

import './Content.scss';
/**
 * Determines if we should show the empty state
 *
 * @param {string} view the current view
 * @param {Object} currentCollection the current collection
 * @return {boolean} empty or not
 */
function isEmpty(view, currentCollection) {
  const {
    items = []
  } = currentCollection;
  return view === VIEW_ERROR || items.length === 0;
}
const Content = ({
  view,
  rootId,
  isSmall,
  rootElement,
  focusedRow,
  hasHitSelectionLimit,
  selectableType,
  currentCollection,
  tableRef,
  canSetShareAccess,
  isSingleSelect,
  onItemClick,
  onItemSelect,
  onShareAccessChange,
  onFocusChange,
  extensionsWhitelist,
  itemActions
}) => /*#__PURE__*/React.createElement("div", {
  className: "bcp-content"
}, view === VIEW_ERROR || view === VIEW_SELECTED ? null : /*#__PURE__*/React.createElement(ProgressBar, {
  percent: currentCollection.percentLoaded
}), isEmpty(view, currentCollection) ? /*#__PURE__*/React.createElement(EmptyView, {
  view: view,
  isLoading: currentCollection.percentLoaded !== 100
}) : /*#__PURE__*/React.createElement(ItemList, {
  view: view,
  rootId: rootId,
  isSmall: isSmall,
  rootElement: rootElement,
  focusedRow: focusedRow,
  currentCollection: currentCollection,
  tableRef: tableRef,
  canSetShareAccess: canSetShareAccess,
  hasHitSelectionLimit: hasHitSelectionLimit,
  isSingleSelect: isSingleSelect,
  selectableType: selectableType,
  onItemSelect: onItemSelect,
  onItemClick: onItemClick,
  onFocusChange: onFocusChange,
  onShareAccessChange: onShareAccessChange,
  extensionsWhitelist: extensionsWhitelist,
  itemActions: itemActions
}));
export default Content;
//# sourceMappingURL=Content.js.map