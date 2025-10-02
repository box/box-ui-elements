function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Item list component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Table, Column } from '@box/react-virtualized/dist/es/Table';
import AutoSizer from '@box/react-virtualized/dist/es/AutoSizer';
import KeyBinder from '../common/KeyBinder';
import nameCellRenderer from '../common/item/nameCellRenderer';
import iconCellRenderer from '../common/item/iconCellRenderer';
// $FlowFixMe TypeScript file
import { ItemOptions } from '../common/item';
import { isFocusableElement, focus } from '../../utils/dom';
import shareAccessCellRenderer from './shareAccessCellRenderer';
import selectionCellRenderer from './selectionCellRenderer';
import isRowSelectable from './cellRendererHelper';
import { VIEW_SELECTED, FIELD_NAME, FIELD_ID, FIELD_SHARED_LINK, TYPE_FOLDER } from '../../constants';
import '@box/react-virtualized/styles.css';
import './ItemList.scss';
const moreOptionsCellRenderer = props => ({
  rowData
}) => /*#__PURE__*/React.createElement("div", {
  className: "bcp-more-options"
}, /*#__PURE__*/React.createElement(ItemOptions, _extends({
  item: rowData
}, props)));
const ItemList = ({
  view,
  rootId,
  isSmall,
  rootElement,
  focusedRow,
  selectableType,
  canSetShareAccess,
  hasHitSelectionLimit,
  isSingleSelect,
  extensionsWhitelist,
  onItemSelect,
  onItemClick,
  onShareAccessChange,
  onFocusChange,
  currentCollection,
  tableRef,
  itemActions
}) => {
  const iconCell = iconCellRenderer();
  const nameCell = nameCellRenderer(rootId, view, onItemClick);
  const selectionCell = selectionCellRenderer(onItemSelect, selectableType, extensionsWhitelist, hasHitSelectionLimit, isSingleSelect);
  const shareAccessCell = shareAccessCellRenderer(onShareAccessChange, canSetShareAccess, selectableType, extensionsWhitelist, hasHitSelectionLimit);
  const moreOptionsCell = moreOptionsCellRenderer({
    itemActions
  });
  const {
    id,
    items = []
  } = currentCollection;
  const rowCount = items.length;
  const rowClassName = ({
    index
  }) => {
    if (index === -1) {
      return '';
    }
    const {
      selected,
      type
    } = items[index];
    const isSelectable = isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, items[index]);
    return classNames(`bcp-item-row bcp-item-row-${index}`, {
      'bcp-item-row-selected': selected && view !== VIEW_SELECTED,
      'bcp-item-row-unselectable': type !== TYPE_FOLDER && !isSelectable // folder row should never dim
    });
  };
  const onRowClick = ({
    event,
    rowData,
    index
  }) => {
    // If the click is happening on a clickable element on the item row, ignore row selection
    if (isRowSelectable(selectableType, extensionsWhitelist, hasHitSelectionLimit, rowData) && !isFocusableElement(event.target)) {
      onItemSelect(rowData);
    } else {
      onFocusChange(index);
    }
  };
  return /*#__PURE__*/React.createElement(KeyBinder, {
    columnCount: 1,
    rowCount: rowCount,
    className: "bcp-item-grid",
    id: id,
    items: items,
    onSelect: onItemSelect,
    onOpen: onItemClick,
    scrollToRow: focusedRow,
    onScrollToChange: ({
      scrollToRow
    }) => focus(rootElement, `.bcp-item-row-${scrollToRow}`)
  }, ({
    onSectionRendered,
    scrollToRow,
    focusOnRender
  }) => /*#__PURE__*/React.createElement(AutoSizer, null, ({
    width,
    height
  }) => /*#__PURE__*/React.createElement(Table, {
    width: width,
    height: height,
    disableHeader: true,
    headerHeight: 0,
    rowHeight: isSmall ? 70 : 50,
    rowCount: rowCount,
    rowGetter: ({
      index
    }) => items[index],
    ref: tableRef,
    rowClassName: rowClassName,
    onRowClick: onRowClick,
    scrollToIndex: scrollToRow,
    onRowsRendered: ({
      startIndex,
      stopIndex
    }) => {
      onSectionRendered({
        rowStartIndex: startIndex,
        rowStopIndex: stopIndex
      });
      if (focusOnRender) {
        focus(rootElement, `.bcp-item-row-${scrollToRow}`);
      }
    }
  }, /*#__PURE__*/React.createElement(Column, {
    dataKey: FIELD_ID,
    cellRenderer: iconCell,
    width: isSmall ? 30 : 50,
    flexShrink: 0
  }), /*#__PURE__*/React.createElement(Column, {
    dataKey: FIELD_NAME,
    cellRenderer: nameCell,
    width: 300,
    flexGrow: 1
  }), isSmall ? null : /*#__PURE__*/React.createElement(Column, {
    dataKey: FIELD_SHARED_LINK,
    cellRenderer: shareAccessCell,
    width: 260,
    flexShrink: 0
  }), !!itemActions?.length && /*#__PURE__*/React.createElement(Column, {
    disableSort: true,
    dataKey: FIELD_ID,
    cellRenderer: moreOptionsCell,
    headerRole: "gridcell",
    width: 58,
    flexShrink: 0
  }), /*#__PURE__*/React.createElement(Column, {
    dataKey: FIELD_ID,
    cellRenderer: selectionCell,
    width: isSmall ? 20 : 30,
    flexShrink: 0
  }))));
};
export default ItemList;
//# sourceMappingURL=ItemList.js.map