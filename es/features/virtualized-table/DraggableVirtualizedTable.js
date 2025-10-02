const _excluded = ["children", "className", "onDragEnd", "rowData", "shouldShowDragHandle", "tableId"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import noop from 'lodash/noop';
import classNames from 'classnames';
import { Column } from '@box/react-virtualized/dist/es/Table/index';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { bdlGray } from '../../styles/variables';
import IconDrag from '../../icons/general/IconDrag';
import { draggableRowRenderer } from '../virtualized-table-renderers';
import { VIRTUALIZED_TABLE_DEFAULTS } from './constants';
import VirtualizedTable from './VirtualizedTable';
import './DraggableVirtualizedTable.scss';
const {
  HEADER_HEIGHT,
  ROW_HEIGHT
} = VIRTUALIZED_TABLE_DEFAULTS;
const ICON_SIZE = 24;
const DraggableVirtualizedTable = _ref => {
  let {
      children,
      className,
      onDragEnd,
      rowData,
      shouldShowDragHandle,
      tableId
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const tableClassName = classNames('bdl-DraggableVirtualizedTable', className);
  const draggableCellRenderer = () => /*#__PURE__*/React.createElement(IconDrag, {
    color: bdlGray,
    height: ICON_SIZE,
    width: ICON_SIZE
  });
  // Virtualized table's performance optimizations can not be used here since
  // all rows need to be rendered in order for drag and drop to work properly.
  // From a UX perspective, it also doesn't make sense to have drag and drop on
  // very large tables that actually require optimizations, so this component
  // always forces the table to be tall enough to fit all rows
  const tableHeight = rowData.length * ROW_HEIGHT + HEADER_HEIGHT;
  const handleDragEnd = ({
    destination,
    source
  }) => {
    const destinationIndex = destination ? destination.index : source.index;
    return onDragEnd(source.index, destinationIndex);
  };
  return /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: handleDragEnd
  }, /*#__PURE__*/React.createElement(Droppable, {
    droppableId: tableId
  }, droppableProvided => /*#__PURE__*/React.createElement("div", {
    ref: droppableProvided.innerRef
  }, /*#__PURE__*/React.createElement(VirtualizedTable, _extends({}, rest, {
    className: tableClassName,
    rowRenderer: draggableRowRenderer,
    height: tableHeight,
    rowData: rowData
  }), shouldShowDragHandle && /*#__PURE__*/React.createElement(Column, {
    cellRenderer: draggableCellRenderer,
    className: "bdl-DraggableVirtualizedTable-dragHandleColumn",
    dataKey: "dragHandle",
    disableSort: true,
    flexGrow: 0,
    headerClassName: "bdl-DraggableVirtualizedTable-dragHandleColumn",
    width: ICON_SIZE
  }), children), droppableProvided.placeholder)));
};
DraggableVirtualizedTable.displayName = 'DraggableVirtualizedTable';
DraggableVirtualizedTable.defaultProps = {
  onDragEnd: noop,
  shouldShowDragHandle: true
};
export default DraggableVirtualizedTable;
//# sourceMappingURL=DraggableVirtualizedTable.js.map