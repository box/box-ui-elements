function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Item List Key bindings
 * @author Box
 */

import React, { PureComponent } from 'react';
import noop from 'lodash/noop';
import { isInputElement } from '../../utils/dom';
class KeyBinder extends PureComponent {
  /**
   * Resets scroll position if props change
   * @private
   * @inheritdoc
   * @return {State|null}
   */
  static getDerivedStateFromProps(props, state) {
    const {
      prevId,
      prevScrollToColumn,
      prevScrollToRow
    } = state;
    const {
      id,
      scrollToColumn: scrollToColumnProp,
      scrollToRow: scrollToRowProp
    } = props;
    if (id !== prevId) {
      return {
        focusOnRender: false,
        prevId: id,
        prevScrollToColumn: 0,
        prevScrollToRow: 0,
        scrollToColumn: 0,
        scrollToRow: 0
      };
    }
    const newState = {};
    if (prevScrollToColumn !== scrollToColumnProp && prevScrollToRow !== scrollToRowProp) {
      newState.prevScrollToColumn = scrollToColumnProp;
      newState.prevScrollToRow = scrollToRowProp;
      newState.scrollToColumn = scrollToColumnProp;
      newState.scrollToRow = scrollToRowProp;
    } else if (scrollToRowProp !== prevScrollToRow) {
      newState.prevScrollToRow = scrollToRowProp;
      newState.scrollToRow = scrollToRowProp;
    } else if (scrollToColumnProp !== prevScrollToColumn) {
      newState.prevScrollToColumn = scrollToColumnProp;
      newState.scrollToColumn = scrollToColumnProp;
    }
    return Object.keys(newState).length ? newState : null;
  }

  /**
   * [constructor]
   *
   * @private
   * @return {KeyBinder}
   */
  constructor(props) {
    super(props);
    /**
     * Keyboard events
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    _defineProperty(this, "onKeyDown", event => {
      if (isInputElement(event.target)) {
        return;
      }
      const {
        columnCount,
        rowCount,
        onSelect,
        onRename,
        onDownload,
        onShare,
        onDelete,
        onOpen,
        items
      } = this.props;
      const {
        scrollToColumn: scrollToColumnPrevious,
        scrollToRow: scrollToRowPrevious
      } = this.state;
      let {
        scrollToColumn,
        scrollToRow
      } = this.state;
      const currentItem = items[scrollToRow];
      const ctrlMeta = event.metaKey || event.ctrlKey;

      // The above cases all prevent default event event behavior.
      // This is to keep the grid from scrolling after the snap-to update.
      switch (event.key) {
        case 'ArrowDown':
          scrollToRow = ctrlMeta ? rowCount - 1 : Math.min(scrollToRow + 1, rowCount - 1);
          event.stopPropagation(); // To prevent the arrow down capture of parent
          break;
        case 'ArrowLeft':
          scrollToColumn = ctrlMeta ? 0 : Math.max(scrollToColumn - 1, 0);
          break;
        case 'ArrowRight':
          scrollToColumn = ctrlMeta ? columnCount - 1 : Math.min(scrollToColumn + 1, columnCount - 1);
          break;
        case 'ArrowUp':
          scrollToRow = ctrlMeta ? 0 : Math.max(scrollToRow - 1, 0);
          break;
        case 'Enter':
          onOpen(currentItem);
          event.preventDefault();
          break;
        case 'Delete':
          onDelete(currentItem);
          event.preventDefault();
          break;
        case 'X':
          onSelect(currentItem);
          event.preventDefault();
          break;
        case 'D':
          onDownload(currentItem);
          event.preventDefault();
          break;
        case 'S':
          onShare(currentItem);
          event.preventDefault();
          break;
        case 'R':
          onRename(currentItem);
          event.preventDefault();
          break;
        default:
          return;
      }
      if (scrollToColumn !== scrollToColumnPrevious || scrollToRow !== scrollToRowPrevious) {
        event.preventDefault();
        this.updateScrollState({
          scrollToColumn,
          scrollToRow
        });
      }
    });
    /**
     * Callback for set of rows rendered
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    _defineProperty(this, "onSectionRendered", ({
      columnStartIndex,
      columnStopIndex,
      rowStartIndex,
      rowStopIndex
    }) => {
      this.columnStartIndex = columnStartIndex;
      this.columnStopIndex = columnStopIndex;
      this.rowStartIndex = rowStartIndex;
      this.rowStopIndex = rowStopIndex;
    });
    const {
      id,
      scrollToRow: _scrollToRow,
      scrollToColumn: _scrollToColumn
    } = props;
    this.state = {
      focusOnRender: false,
      prevId: id,
      prevScrollToColumn: _scrollToColumn,
      prevScrollToRow: _scrollToRow,
      scrollToColumn: _scrollToColumn,
      scrollToRow: _scrollToRow
    };
    this.columnStartIndex = 0;
    this.columnStopIndex = 0;
    this.rowStartIndex = 0;
    this.rowStopIndex = 0;
  }
  /**
   * Updates the scroll states
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  updateScrollState({
    scrollToColumn,
    scrollToRow
  }) {
    const {
      onScrollToChange
    } = this.props;
    onScrollToChange({
      scrollToColumn,
      scrollToRow
    });
    this.setState({
      scrollToColumn,
      scrollToRow,
      focusOnRender: true
    });
  }

  /**
   * Renders the HOC
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  render() {
    const {
      className,
      children
    } = this.props;
    const {
      scrollToColumn,
      scrollToRow,
      focusOnRender
    } = this.state;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return /*#__PURE__*/React.createElement("div", {
      className: className,
      onKeyDown: this.onKeyDown
    }, children({
      onSectionRendered: this.onSectionRendered,
      scrollToColumn,
      scrollToRow,
      focusOnRender
    }));
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
_defineProperty(KeyBinder, "defaultProps", {
  scrollToColumn: 0,
  scrollToRow: 0,
  onRename: noop,
  onShare: noop,
  onDownload: noop,
  onOpen: noop,
  onSelect: noop,
  onDelete: noop
});
export default KeyBinder;
//# sourceMappingURL=KeyBinder.js.map