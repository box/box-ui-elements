function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import Checkbox from '../../../components/checkbox/Checkbox';
import DraggableList from '../../../components/draggable-list';
import PortaledDraggableListItem from '../../../components/draggable-list/PortaledDraggableListItem';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import reorder from '../../../components/draggable-list/draggable-list-utils/reorder';
import messages from '../messages';
class ColumnButtonOverlay extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onDragEnd", (sourceIndex, destinationIndex) => {
      const {
        pendingColumns
      } = this.state;
      const columns = reorder(pendingColumns, sourceIndex, destinationIndex);
      this.setState({
        pendingColumns: cloneDeep(columns)
      });
    });
    _defineProperty(this, "updatePendingColumns", column => {
      const {
        pendingColumns
      } = this.state;
      const pendingColumnsCopy = cloneDeep(pendingColumns);
      const newColumn = _objectSpread(_objectSpread({}, column), {}, {
        isShown: !column.isShown
      });
      const foundIndex = pendingColumnsCopy.findIndex(originalColumn => originalColumn.id === column.id);
      pendingColumnsCopy[foundIndex] = newColumn;
      this.setState({
        pendingColumns: pendingColumnsCopy
      });
    });
    _defineProperty(this, "applyFilters", () => {
      const {
        onColumnChange
      } = this.props;
      const {
        pendingColumns
      } = this.state;
      if (onColumnChange) {
        onColumnChange(pendingColumns);
      }
    });
    _defineProperty(this, "getNumberOfHiddenColumns", () => {
      const {
        columns
      } = this.props;
      return columns ? columns.reduce((total, column) => {
        if (!column.isShown) {
          return total + 1;
        }
        return total;
      }, 0) : 0;
    });
    this.state = {
      listId: uniqueId(),
      pendingColumns: props.columns ? cloneDeep(props.columns) : []
    };
  }
  render() {
    const {
      listId,
      pendingColumns
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "column-button-dropdown"
    }, /*#__PURE__*/React.createElement("div", {
      className: "column-button-dropdown-header"
    }, /*#__PURE__*/React.createElement(DraggableList, {
      className: "draggable-list-example",
      listId: listId,
      onDragEnd: this.onDragEnd
    }, pendingColumns.map((item, index) => {
      return /*#__PURE__*/React.createElement(PortaledDraggableListItem, {
        id: item.id,
        index: index,
        isDraggableViaHandle: true,
        key: index
      }, /*#__PURE__*/React.createElement(Checkbox, {
        isChecked: item.isShown,
        label: item.displayName,
        name: item.displayName,
        onChange: () => this.updatePendingColumns(item)
      }));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "column-button-dropdown-footer"
    }, /*#__PURE__*/React.createElement(PrimaryButton, {
      type: "button",
      onClick: this.applyFilters
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.applyFiltersButtonText))));
  }
}
export default ColumnButtonOverlay;
//# sourceMappingURL=ColumnButtonOverlay.js.map