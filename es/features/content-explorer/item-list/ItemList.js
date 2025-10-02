function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import PropTypes from 'prop-types';
import * as React from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import AutoSizer from '@box/react-virtualized/dist/commonjs/AutoSizer';
import Column from '@box/react-virtualized/dist/commonjs/Table/Column';
import Table from '@box/react-virtualized/dist/commonjs/Table';
import defaultTableRowRenderer from '@box/react-virtualized/dist/commonjs/Table/defaultRowRenderer';
import '@box/react-virtualized/styles.css';
import { withInfiniteLoader } from '../../../components/react-virtualized-helpers';
import { ContentExplorerModePropType, ItemsPropType, ItemsMapPropType } from '../prop-types';
import ItemListIcon from './ItemListIcon';
import ItemListLoadingPlaceholder from './ItemListLoadingPlaceholder';
import ItemListName from './ItemListName';
import ItemListButton from './ItemListButton';
import './ItemList.scss';
const TABLE_CELL_CLASS = 'table-cell';
const InfiniteLoaderTable = withInfiniteLoader(Table);
const DEFAULT_ROW_HEIGHT = 40;
const withAutoSizer = WrappedComponent => {
  return props => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(AutoSizer, null, ({
      width: w,
      height: h
    }) => /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      width: w,
      height: h
    }))));
  };
};
const TableResponsive = withAutoSizer(Table);
const itemIconCellRenderer = rendererParams => {
  const {
    rowData: {
      type,
      extension,
      hasCollaborations,
      isExternallyOwned,
      archiveType
    },
    columnData: {
      itemIconRenderer
    }
  } = rendererParams;
  return /*#__PURE__*/React.createElement("div", {
    className: TABLE_CELL_CLASS
  }, itemIconRenderer ? itemIconRenderer(rendererParams) : /*#__PURE__*/React.createElement(ItemListIcon, {
    type: type,
    extension: extension,
    hasCollaborations: hasCollaborations,
    isExternallyOwned: isExternallyOwned,
    archiveType: archiveType
  }));
};
const isItemSelected = (itemId, selectedItems) => selectedItems[itemId] !== undefined;
const itemNameCellRenderer = rendererParams => {
  const {
    rowIndex,
    rowData: {
      id,
      type,
      name,
      label
    },
    columnData: {
      selectedItems,
      onItemNameClick,
      itemNameLinkRenderer
    }
  } = rendererParams;
  // loading placeholder may not have name and ItemListName requires name
  return name && /*#__PURE__*/React.createElement("div", {
    className: TABLE_CELL_CLASS
  }, /*#__PURE__*/React.createElement(ItemListName, {
    itemId: id,
    type: type,
    name: name,
    label: label,
    isSelected: isItemSelected(id, selectedItems),
    onClick: event => onItemNameClick(event, rowIndex),
    linkRenderer: itemNameLinkRenderer
  }));
};
const renderItemListButton = (contentExplorerMode, id, isActionDisabled, isDisabled, name, selectedItems) => name && /*#__PURE__*/React.createElement(ItemListButton, {
  contentExplorerMode: contentExplorerMode,
  id: id,
  isDisabled: isActionDisabled,
  isSelected: isItemSelected(id, selectedItems),
  name: name
});
const itemButtonCellRenderer = rendererParams => {
  const {
    columnData: {
      contentExplorerMode,
      itemButtonRenderer,
      selectedItems
    },
    rowData: {
      id,
      isActionDisabled,
      isDisabled,
      name
    }
  } = rendererParams;
  return !isDisabled && /*#__PURE__*/React.createElement("div", {
    className: TABLE_CELL_CLASS
  }, itemButtonRenderer ? itemButtonRenderer(rendererParams) : renderItemListButton(contentExplorerMode, id, isActionDisabled, isDisabled, name, selectedItems));
};
const itemLoadingPlaceholderRenderer = rendererParams => {
  const {
    loadingPlaceholderColumnWidths,
    columnIndex
  } = rendererParams;
  return /*#__PURE__*/React.createElement("div", {
    className: TABLE_CELL_CLASS
  }, /*#__PURE__*/React.createElement(ItemListLoadingPlaceholder, {
    width: loadingPlaceholderColumnWidths && loadingPlaceholderColumnWidths[columnIndex]
  }));
};
const ItemList = ({
  additionalColumns,
  contentExplorerMode,
  className = '',
  isResponsive = false,
  items,
  numItemsPerPage,
  numTotalItems,
  selectedItems = {},
  onItemClick,
  onItemDoubleClick,
  onItemNameClick,
  onLoadMoreItems,
  headerHeight,
  headerRenderer,
  itemIconRenderer,
  itemNameLinkRenderer,
  itemButtonRenderer,
  itemRowRenderer = defaultTableRowRenderer,
  noItemsRenderer,
  width,
  height,
  rowHeight = DEFAULT_ROW_HEIGHT
}) => {
  const getRow = ({
    index
  }) => items[index];
  const getRowClassNames = (index, item) => {
    let result = index === -1 ? 'table-header' : 'table-row';
    if (isItemSelected(item.id, selectedItems)) {
      result = classNames('is-selected', result);
    }
    if (item && (item.isDisabled || item.isLoading)) {
      result = classNames('disabled', result);
    }
    return result;
  };
  const renderRow = rendererParams => {
    const {
      index,
      key,
      style,
      className: rowClassName,
      columns
    } = rendererParams;
    const item = items[index];
    const itemRowClassname = classNames(rowClassName, getRowClassNames(index, item));
    const testId = getProp(rendererParams, 'rowData.id', '');
    if (item.isLoading) {
      return /*#__PURE__*/React.createElement("div", {
        key: key,
        style: style,
        className: itemRowClassname,
        role: "row"
      }, columns.map((column, columnIndex) => /*#__PURE__*/React.createElement("div", {
        key: columnIndex,
        className: column.props.className,
        style: column.props.style,
        role: "gridcell"
      }, itemLoadingPlaceholderRenderer({
        item,
        columnIndex
      }))));
    }
    const defaultRow = itemRowRenderer(_objectSpread(_objectSpread({}, rendererParams), {}, {
      className: itemRowClassname
    }));
    return /*#__PURE__*/React.cloneElement(defaultRow, {
      'data-testid': `item-row-${testId}`
    });
  };
  let TableComponent = isResponsive ? TableResponsive : Table;
  const tableProps = {};
  if (onLoadMoreItems) {
    TableComponent = InfiniteLoaderTable;
    tableProps.infiniteLoaderProps = {
      isRowLoaded: getRow,
      loadMoreRows: onLoadMoreItems,
      minimumBatchSize: numItemsPerPage,
      rowCount: numTotalItems,
      threshold: numItemsPerPage
    };
  }
  if (!noItemsRenderer || items.length > 0) {
    tableProps.headerHeight = headerHeight;
    tableProps.headerRowRenderer = headerRenderer;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('content-explorer-item-list table', className, {
      'bdl-ContentExplorerItemList--responsive': isResponsive
    })
  }, /*#__PURE__*/React.createElement(TableComponent, _extends({
    gridClassName: "table-body",
    headerClassName: "table-header-item",
    width: width,
    height: height,
    rowHeight: rowHeight,
    rowCount: items.length,
    onRowClick: onItemClick,
    onRowDoubleClick: onItemDoubleClick,
    rowGetter: getRow,
    rowRenderer: renderRow,
    noRowsRenderer: noItemsRenderer
  }, tableProps), /*#__PURE__*/React.createElement(Column, {
    className: "item-list-icon-col",
    cellRenderer: itemIconCellRenderer,
    columnData: {
      itemIconRenderer
    },
    dataKey: "icon",
    width: 32
  }), /*#__PURE__*/React.createElement(Column, {
    className: "item-list-name-col",
    cellRenderer: itemNameCellRenderer,
    columnData: {
      selectedItems,
      onItemNameClick,
      itemNameLinkRenderer
    },
    dataKey: "name",
    width: 0,
    flexGrow: 1,
    flexShrink: 0
  }), additionalColumns, /*#__PURE__*/React.createElement(Column, {
    className: "item-list-button-col",
    cellRenderer: itemButtonCellRenderer,
    columnData: {
      contentExplorerMode,
      itemButtonRenderer,
      selectedItems
    },
    dataKey: "button",
    width: 30
  })));
};
ItemList.displayName = 'ItemList';
ItemList.propTypes = {
  additionalColumns: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string,
  contentExplorerMode: ContentExplorerModePropType.isRequired,
  isResponsive: PropTypes.bool,
  items: ItemsPropType.isRequired,
  numItemsPerPage: PropTypes.number,
  numTotalItems: PropTypes.number,
  selectedItems: ItemsMapPropType.isRequired,
  onItemClick: PropTypes.func,
  onItemDoubleClick: PropTypes.func,
  onItemNameClick: PropTypes.func,
  onLoadMoreItems: PropTypes.func,
  headerHeight: PropTypes.number,
  headerRenderer: PropTypes.func,
  itemIconRenderer: PropTypes.func,
  itemNameLinkRenderer: PropTypes.func,
  itemButtonRenderer: PropTypes.func,
  itemRowRenderer: PropTypes.func,
  noItemsRenderer: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rowHeight: PropTypes.number
};
export { ItemList as ItemListBase };
export default ItemList;
//# sourceMappingURL=ItemList.js.map