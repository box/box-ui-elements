function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { CellMeasurer, CellMeasurerCache } from '@box/react-virtualized/dist/es/CellMeasurer';
import Table, { Column } from '@box/react-virtualized/dist/es/Table';
import getProp from 'lodash/get';
import GridViewSlot from './GridViewSlot';
import '@box/react-virtualized/styles.css';
import './GridView.scss';
class GridView extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "cache", new CellMeasurerCache({
      defaultHeight: 300,
      defaultWidth: 400,
      fixedWidth: true
    }));
    _defineProperty(this, "cellRenderer", ({
      dataKey,
      parent,
      rowIndex
    }) => {
      const {
        columnCount,
        currentCollection,
        slotRenderer
      } = this.props;
      const count = getProp(currentCollection, 'items.length', 0);
      const contents = [];
      const startingIndex = rowIndex * columnCount;
      const maxSlotIndex = Math.min(startingIndex + columnCount, count);
      for (let slotIndex = startingIndex; slotIndex < maxSlotIndex; slotIndex += 1) {
        const {
          id,
          selected
        } = getProp(currentCollection, `items[${slotIndex}]`);

        // using item's id as key is important for renrendering.  React Virtualized Table rerenders
        // on every 1px scroll, so using improper key would lead to image flickering in each
        // card of the grid view when scrolling.
        contents.push(/*#__PURE__*/React.createElement(GridViewSlot, {
          key: id,
          selected: selected,
          slotIndex: slotIndex,
          slotRenderer: slotRenderer,
          slotWidth: `${(100 / columnCount).toFixed(4)}%`
        }));
      }
      return /*#__PURE__*/React.createElement(CellMeasurer, {
        key: dataKey,
        cache: this.cache,
        columnIndex: 0,
        parent: parent,
        rowIndex: rowIndex
      }, /*#__PURE__*/React.createElement("div", {
        className: "bdl-GridView-row"
      }, contents));
    });
    _defineProperty(this, "rowGetter", ({
      index
    }) => {
      return index;
    });
  }
  componentDidUpdate({
    columnCount: prevColumnCount,
    width: prevWidth
  }) {
    const {
      columnCount,
      width
    } = this.props;

    // The React Virtualized Table must be notified whenever the heights of rows
    // could potentially change. If omitted, rows are sized
    // incorrectly resulting in gaps or content overlap.
    if (columnCount !== prevColumnCount || width !== prevWidth) {
      this.cache.clearAll();
      this.forceUpdate();
    }
  }
  render() {
    const {
      columnCount,
      currentCollection,
      height,
      scrollToRow = 0,
      width
    } = this.props;
    const count = getProp(currentCollection, 'items.length', 0);
    const rowCount = Math.ceil(count / columnCount);
    return /*#__PURE__*/React.createElement(Table, {
      className: "bdl-GridView",
      disableHeader: true,
      height: height,
      rowCount: rowCount,
      rowGetter: this.rowGetter,
      rowHeight: this.cache.rowHeight,
      width: width,
      gridClassName: "bdl-GridView-body",
      rowClassName: "bdl-GridView-tableRow",
      scrollToIndex: scrollToRow,
      sortDirection: "ASC"
    }, /*#__PURE__*/React.createElement(Column, {
      cellRenderer: this.cellRenderer,
      dataKey: "",
      flexGrow: 1,
      width: 400
    }));
  }
}
export default GridView;
//# sourceMappingURL=GridView.js.map