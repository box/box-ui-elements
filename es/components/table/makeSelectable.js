function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Set } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { Hotkeys, HotkeyRecord } from '../hotkeys';
import messages from './messages';
import shiftSelect from './shiftSelect';
const SEARCH_TIMER_DURATION = 1000;
function makeSelectable(BaseTable) {
  var _SelectableTable;
  const originalDisplayName = BaseTable.displayName || BaseTable.name || 'Table';
  return _SelectableTable = class SelectableTable extends Component {
    constructor(props) {
      super(props);
      _defineProperty(this, "state", {
        focusedIndex: undefined
      });
      _defineProperty(this, "onSelect", (selectedItems, newFocusedIndex) => {
        const {
          onSelect
        } = this.props;
        this.previousIndex = this.state.focusedIndex || 0;
        this.setState({
          focusedIndex: newFocusedIndex
        });
        if (onSelect) {
          // If selectedItems were given as an Immutable Set, they should also be returned as one,
          // and vice versa if they were given as a native JS array
          onSelect(Set.isSet(this.props.selectedItems) ? selectedItems : selectedItems.toJS());
        }
      });
      _defineProperty(this, "getSharedHotkeyConfigs", () => {
        const {
          hotkeyType
        } = this.props;
        return [new HotkeyRecord({
          key: 'shift+x',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftXDescription),
          handler: () => {
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            this.selectToggle(focusedIndex);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: ['meta+a', 'ctrl+a'],
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.selectAllDescription),
          handler: event => {
            const {
              data
            } = this.props;
            event.preventDefault();
            this.onSelect(new Set(data), this.state.focusedIndex);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'esc',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.deselectAllDescription),
          handler: () => {
            this.onSelect(new Set(), this.state.focusedIndex);
          },
          type: hotkeyType
        })];
      });
      _defineProperty(this, "getListViewHotKeyConfigs", () => {
        const {
          hotkeyType
        } = this.props;
        return [new HotkeyRecord({
          key: 'down',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.downDescription),
          handler: event => {
            if (this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              data
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = focusedIndex !== undefined ? Math.min(focusedIndex + 1, data.length - 1) : 0;
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'up',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.upDescription),
          handler: event => {
            if (this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              focusedIndex = 0
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+down',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftDownDescription),
          handler: () => {
            const {
              data
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.min(focusedIndex + 1, data.length - 1);
            this.handleShiftKeyDown(newFocusedIndex, data.length - 1);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+up',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftUpDescription),
          handler: () => {
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
            this.handleShiftKeyDown(newFocusedIndex, 0);
          },
          type: hotkeyType
        })];
      });
      _defineProperty(this, "getGridViewHotKeyConfigs", () => {
        const {
          hotkeyType
        } = this.props;
        return [new HotkeyRecord({
          key: 'right',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.downDescription),
          handler: event => {
            if (this.isTargetSlider(event) || this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              data
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = focusedIndex !== undefined ? Math.min(focusedIndex + 1, data.length - 1) : 0;
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'left',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.upDescription),
          handler: event => {
            if (this.isTargetSlider(event) || this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              focusedIndex = 0
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'down',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.downDescription),
          handler: event => {
            if (this.isTargetSlider(event) || this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              data,
              gridColumnCount
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = focusedIndex !== undefined ? Math.min(focusedIndex + gridColumnCount, data.length - 1) : 0;
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'up',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.upDescription),
          handler: event => {
            if (this.isTargetSlider(event) || this.shouldNotAllowArrowKeyNavigation(event)) {
              return;
            }
            const {
              gridColumnCount
            } = this.props;
            const {
              focusedIndex = 0
            } = this.state;
            event.preventDefault();
            const newFocusedIndex = Math.max(focusedIndex - gridColumnCount, 0);
            this.setState({
              focusedIndex: newFocusedIndex
            });
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+right',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftDownDescription),
          handler: () => {
            const {
              data
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.min(focusedIndex + 1, data.length - 1);
            this.handleShiftKeyDownForGrid(newFocusedIndex, data.length - 1);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+left',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftUpDescription),
          handler: () => {
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.max(focusedIndex - 1, 0);
            this.handleShiftKeyDownForGrid(newFocusedIndex, 0);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+down',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftDownDescription),
          handler: () => {
            const {
              data,
              gridColumnCount
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.min(focusedIndex + gridColumnCount, data.length - 1);
            this.handleShiftKeyDownForGrid(newFocusedIndex, data.length - 1);
          },
          type: hotkeyType
        }), new HotkeyRecord({
          key: 'shift+up',
          description: /*#__PURE__*/React.createElement(FormattedMessage, messages.shiftUpDescription),
          handler: () => {
            const {
              gridColumnCount
            } = this.props;
            const {
              focusedIndex
            } = this.state;
            if (focusedIndex === undefined) {
              return;
            }
            const newFocusedIndex = Math.max(focusedIndex - gridColumnCount, 0);
            this.handleShiftKeyDownForGrid(newFocusedIndex, 0);
          },
          type: hotkeyType
        })];
      });
      _defineProperty(this, "getHotkeyConfigs", () => {
        const {
          enableHotkeys,
          isGridView,
          gridColumnCount
        } = this.props;
        if (!enableHotkeys && !this.hotkeys) {
          this.hotkeys = [];
        }
        if (!this.hotkeys) {
          const viewSpecificHotKeyConfigs = isGridView && gridColumnCount !== undefined ? this.getGridViewHotKeyConfigs() : this.getListViewHotKeyConfigs();
          this.hotkeys = [...this.getSharedHotkeyConfigs(), ...viewSpecificHotKeyConfigs];
        }
        return this.hotkeys;
      });
      _defineProperty(this, "getProcessedProps", () => {
        const {
          data,
          loadedData,
          selectedItems
        } = this.props;
        return _objectSpread(_objectSpread({}, this.props), {}, {
          loadedData: loadedData ? Set(loadedData) : Set(data),
          selectedItems: Set.isSet(selectedItems) ? selectedItems : new Set(selectedItems)
        });
      });
      _defineProperty(this, "hotkeys", null);
      _defineProperty(this, "selectToggle", rowIndex => {
        const {
          data,
          selectedItems
        } = this.getProcessedProps();
        if (selectedItems.has(data[rowIndex])) {
          this.onSelect(selectedItems.delete(data[rowIndex]), rowIndex);
        } else {
          this.onSelect(selectedItems.add(data[rowIndex]), rowIndex);
        }
        this.anchorIndex = rowIndex;
      });
      _defineProperty(this, "selectRange", rowIndex => {
        const {
          data,
          selectedItems
        } = this.getProcessedProps();

        // Don't change selection if we're shift-clicking the same row
        if (rowIndex === this.previousIndex) {
          return;
        }

        // Converts set of items to set of indices to do some slicing magic
        const selectedRows = new Set(data.reduce((rows, item, i) => {
          if (selectedItems.has(item)) {
            rows.push(i);
          }
          return rows;
        }, []));
        const newSelectedRows = shiftSelect(selectedRows, this.previousIndex, rowIndex, this.anchorIndex);

        // Converts set back to set of items
        const newSelectedItems = newSelectedRows.map(i => data[i]);
        this.onSelect(newSelectedItems, rowIndex);
      });
      _defineProperty(this, "selectOne", rowIndex => {
        const {
          data,
          selectedItems
        } = this.getProcessedProps();

        // Don't change selection if we're clicking on a row that we've already selected
        // This allows us to use the native onDoubleClick handler because we're referencing the
        // same DOM node on double-click.
        if (selectedItems.has(data[rowIndex]) && selectedItems.size === 1) {
          return;
        }
        this.onSelect(new Set([data[rowIndex]]), rowIndex);
        this.anchorIndex = rowIndex;
      });
      _defineProperty(this, "clearFocus", () => {
        this.setState({
          focusedIndex: undefined
        });
      });
      _defineProperty(this, "handleRowClick", (event, index) => {
        if (event.metaKey || event.ctrlKey) {
          this.selectToggle(index);
        } else if (event.shiftKey) {
          this.selectRange(index);
        } else {
          this.selectOne(index);
        }
      });
      _defineProperty(this, "handleRowFocus", (event, index) => {
        const {
          selectedItems
        } = this.getProcessedProps();
        this.onSelect(selectedItems, index);
      });
      _defineProperty(this, "handleTableBlur", () => {
        const {
          focusedIndex
        } = this.state;
        if (focusedIndex !== undefined) {
          // table may get focus back right away in the same tick, in which case we shouldn't clear focus
          this.blurTimerID = setTimeout(this.clearFocus);
        }
      });
      _defineProperty(this, "handleTableFocus", () => {
        clearTimeout(this.blurTimerID);
      });
      _defineProperty(this, "handleShiftKeyDown", (newFocusedIndex, boundary) => {
        const {
          data,
          selectedItems
        } = this.getProcessedProps();
        const {
          focusedIndex
        } = this.state;
        const focusedIndexData = data[focusedIndex];
        const newFocusedIndexData = data[newFocusedIndex];

        // if we're at a boundary of the table and the row is selected, no-op
        if (focusedIndex === boundary && selectedItems.has(focusedIndexData)) {
          return;
        }

        // if both the target and source are not selected, select them both
        if (!selectedItems.has(focusedIndexData) && !selectedItems.has(newFocusedIndexData)) {
          this.onSelect(selectedItems.union([focusedIndexData, newFocusedIndexData]), newFocusedIndex);
          return;
        }

        // if target is not selected, select it
        if (!selectedItems.has(newFocusedIndexData)) {
          this.onSelect(selectedItems.add(newFocusedIndexData), newFocusedIndex);
          return;
        }

        // if both source and target are selected, deselect source
        if (selectedItems.has(newFocusedIndexData) && selectedItems.has(focusedIndexData)) {
          this.onSelect(selectedItems.delete(focusedIndexData), newFocusedIndex);
          return;
        }

        // if target is selected and source is not, select source
        this.onSelect(selectedItems.add(focusedIndexData), newFocusedIndex);
      });
      _defineProperty(this, "isContiguousSelection", (selectedItemIndecies, sourceIndex, targetIndex) => {
        if (sourceIndex < targetIndex && selectedItemIndecies.has(sourceIndex - 1)) {
          return true;
        }
        if (targetIndex < sourceIndex && selectedItemIndecies.has(sourceIndex + 1)) {
          return true;
        }
        return false;
      });
      _defineProperty(this, "handleShiftKeyDownForGrid", newFocusedIndex => {
        const {
          data,
          loadedData,
          selectedItems
        } = this.getProcessedProps();
        const {
          focusedIndex
        } = this.state;
        const dataSize = data.length;
        const targetIndex = newFocusedIndex < 0 ? 0 : Math.min(newFocusedIndex, dataSize - 1);
        const isSourceSelected = selectedItems.has(data[focusedIndex]);
        const isTargetSelected = selectedItems.has(data[targetIndex]);

        // if data is not loaded, we don't want it to be able to be selected
        if (!loadedData.has(data[targetIndex])) {
          return;
        }
        const selectedItemIndices = new Set(data.reduce((rows, item, i) => {
          if (selectedItems.has(item)) {
            rows.push(i);
          }
          return rows;
        }, []));

        // reset the anchor on a new selection block
        if (!isSourceSelected && !isTargetSelected &&
        // if we are starting a new mass selection adjacent selected block, we want to connect them
        !this.isContiguousSelection(selectedItemIndices, focusedIndex, targetIndex)) {
          this.anchorIndex = focusedIndex;
        }
        const newSelectedItemIndices = shiftSelect(selectedItemIndices, focusedIndex, targetIndex, this.anchorIndex);
        const newSelectedItems = newSelectedItemIndices.map(i => data[i]);
        this.onSelect(newSelectedItems, targetIndex);
      });
      _defineProperty(this, "handleKeyboardSearch", event => {
        const {
          searchStrings
        } = this.props;
        if (!searchStrings) {
          return;
        }
        if (event.target.hasAttribute('contenteditable') || event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
          return;
        }

        // character keys have a value for event.which
        if (event.which === 0) {
          return;
        }
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout);
        }
        this.searchString += event.key;
        this.searchTimeout = setTimeout(() => {
          this.searchString = '';
        }, SEARCH_TIMER_DURATION);
        const index = searchStrings.findIndex(string => string.trim().toLowerCase().indexOf(this.searchString) === 0);
        if (index !== -1) {
          this.setState({
            focusedIndex: index
          });
        }
      });
      _defineProperty(this, "handleCheckboxClick", (event, index) => {
        if (event.nativeEvent.shiftKey) {
          this.selectRange(index);
        } else {
          this.selectToggle(index);
        }
      });
      _defineProperty(this, "isTargetSlider", event => event.target?.role === 'slider');
      // Workaround for focus conflicting with Blueprint components for QuickSearch result, recent items and Quick Filters
      _defineProperty(this, "isTargetQuickSearch", event => {
        if (!event.target) {
          return false;
        }
        const {
          className,
          dataset
        } = event.target;

        // Quick Search Button (See All etc)
        if (className?.includes('bp_text_button_module')) {
          return true;
        }

        // QuickSearch Recent Item
        if (className?.includes('quickSearchRecentItem')) {
          return true;
        }

        // Quick Search Result Item and Footer
        if (className?.includes('quickSearchResultItem') || className?.includes('quickSearchQueryFooter')) {
          return true;
        }

        // Blueprint's <FilterChip>
        if (dataset && 'radixCollectionItem' in dataset) {
          return true;
        }

        // Blueprint's <SmallList>
        if (dataset && 'bpSmallListItem' in dataset) {
          return true;
        }
        return false;
      });
      _defineProperty(this, "isFlyoutOpen", () => document.querySelector('.flyout-overlay') !== null);
      _defineProperty(this, "isDropdownMenuOpen", () => document.querySelector('.dropdown-menu-element') !== null);
      _defineProperty(this, "shouldNotAllowArrowKeyNavigation", event => this.isTargetQuickSearch(event) || this.isFlyoutOpen() || this.isDropdownMenuOpen());
      this.anchorIndex = 0;
      this.searchString = '';
      this.searchTimeout = null;

      // we have to store the previously focused index because a focus event
      // will be fired before the click event; thus, in the click handler,
      // the focusedItem will already be the new item
      this.previousIndex = 0;
      this.blurTimerID = null;
    }
    componentDidMount() {
      document.addEventListener('keypress', this.handleKeyboardSearch);
    }
    componentDidUpdate(prevProps, prevState) {
      if (prevState.focusedIndex !== this.state.focusedIndex && this.props.onFocus) {
        this.props.onFocus(this.state.focusedIndex);
      }
    }
    componentWillUnmount() {
      document.removeEventListener('keypress', this.handleKeyboardSearch);
      clearTimeout(this.blurTimerID);
    }
    render() {
      const {
        className,
        data
      } = this.props;
      const {
        focusedIndex
      } = this.state;
      const focusedItem = data[focusedIndex];
      return /*#__PURE__*/React.createElement(Hotkeys, {
        configs: this.getHotkeyConfigs()
      }, /*#__PURE__*/React.createElement(BaseTable, _extends({}, this.props, {
        className: classNames(className, 'is-selectable'),
        focusedIndex: focusedIndex,
        focusedItem: focusedItem,
        onCheckboxClick: this.handleCheckboxClick,
        onRowClick: this.handleRowClick,
        onRowFocus: this.handleRowFocus,
        onTableBlur: this.handleTableBlur,
        onTableFocus: this.handleTableFocus
      })));
    }
  }, _defineProperty(_SelectableTable, "displayName", `Selectable(${originalDisplayName})`), _defineProperty(_SelectableTable, "propTypes", {
    className: PropTypes.string,
    /** Array of unique IDs of the items in the table. Each item should be a string or number, in the order they appear in the table. */
    data: PropTypes.array.isRequired,
    gridColumnCount: PropTypes.number,
    isGridView: PropTypes.bool,
    /** Called when focus changes. `(focusedIndex: number) => void` */
    onFocus: PropTypes.func,
    /** Called when selection changes. `(selectedItems: Array<string> | Array<number> | Set<string> | Set<number>) => void` */
    onSelect: PropTypes.func.isRequired,
    /**
     * Array of strings for keyboard search corresponding to the data prop. If not provided, keyboard search won't work.
     * Example: data = ['f_123', 'f_456'], and corresponding searchStrings = ['file.png', 'another file.pdf']
     */
    searchStrings: PropTypes.array,
    /**
     * Array of IDs that are currently selected, in any order.
     * If you pass a native JS array, then your onSelect function will be called with a native JS array;
     * likewise, if you pass an ImmutableJS Set, then your onSelect function will be called
     * with an ImmutableJS Set.
     */
    selectedItems: PropTypes.oneOfType([PropTypes.array, ImmutablePropTypes.set]),
    /** Array of unique IDs of the items in the table that are loaded and accessible. If not provided, this will default to all data */
    loadedData: PropTypes.array,
    enableHotkeys: PropTypes.bool,
    /** Translated type for hotkeys. If not provided, then the hotkeys will not appear in the help modal. */
    hotkeyType: PropTypes.string
  }), _defineProperty(_SelectableTable, "defaultProps", {
    selectedItems: new Set()
  }), _SelectableTable;
}
export default makeSelectable;
//# sourceMappingURL=makeSelectable.js.map