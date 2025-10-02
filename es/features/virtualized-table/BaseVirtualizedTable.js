const _excluded = ["children", "className", "isLoading", "loadingRowCount", "rowData", "rowGetter", "rowRenderer", "sort", "tableRef"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Table } from '@box/react-virtualized/dist/es/Table/index';
import { DEFAULT_PAGE_SIZE } from '../../constants';
import { VIRTUALIZED_TABLE_DEFAULTS } from './constants';
import loadingRowRenderer from '../virtualized-table-renderers/loadingRowRenderer';
const {
  HEADER_HEIGHT,
  ROW_HEIGHT,
  TAB_INDEX
} = VIRTUALIZED_TABLE_DEFAULTS;
const handleSort = (sortParams, sort = noop) => {
  const {
    event
  } = sortParams;
  const {
    currentTarget,
    type
  } = event || {};

  // Prevent header from remaining focused when triggered with mouse
  if (type === 'click' && currentTarget && currentTarget.blur) {
    currentTarget.blur();
  }
  sort(sortParams);
};
class BaseVirtualizedTable extends React.PureComponent {
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        isLoading,
        loadingRowCount,
        rowData,
        rowGetter,
        rowRenderer,
        sort,
        tableRef
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const displayRowData = isLoading ? Array(loadingRowCount).fill({}) : rowData;
    const tableRowRenderer = isLoading ? loadingRowRenderer : rowRenderer;
    const getRow = rowGetter || (({
      index
    }) => displayRowData[index]);
    return /*#__PURE__*/React.createElement(Table, _extends({
      ref: tableRef,
      className: classNames('bdl-VirtualizedTable', className),
      headerHeight: HEADER_HEIGHT,
      rowCount: displayRowData.length,
      rowGetter: getRow,
      rowHeight: ROW_HEIGHT,
      rowRenderer: tableRowRenderer,
      sort: sortParams => handleSort(sortParams, sort),
      tabIndex: TAB_INDEX
    }, rest), children);
  }
}
_defineProperty(BaseVirtualizedTable, "defaultProps", {
  isLoading: false,
  loadingRowCount: DEFAULT_PAGE_SIZE
});
export default BaseVirtualizedTable;
//# sourceMappingURL=BaseVirtualizedTable.js.map