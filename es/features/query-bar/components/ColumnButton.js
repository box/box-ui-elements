function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Flyout, Overlay } from '../../../components/flyout';
import Button from '../../../components/button/Button';
import MenuToggle from '../../../components/dropdown-menu/MenuToggle';
import IconMetadataColumns from '../../../icons/metadata-view/IconMetadataColumns';
import ColumnButtonOverlay from './ColumnButtonOverlay';
import messages from '../messages';
class ColumnButton extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onClose", () => {
      this.setState({
        isColumnMenuOpen: false
      });
    });
    _defineProperty(this, "onOpen", () => {
      this.setState({
        isColumnMenuOpen: true
      });
    });
    _defineProperty(this, "toggleColumnButton", () => {
      this.setState({
        isColumnMenuOpen: !this.state.isColumnMenuOpen
      });
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
      isColumnMenuOpen: false
    };
  }
  render() {
    const {
      template,
      columns,
      onColumnChange
    } = this.props;
    const {
      isColumnMenuOpen
    } = this.state;
    const numberOfHiddenColumns = this.getNumberOfHiddenColumns();
    const buttonClasses = classNames('query-bar-button', numberOfHiddenColumns !== 0 ? 'is-active' : '');
    let columnsButtonText;
    if (numberOfHiddenColumns === 0) {
      columnsButtonText = /*#__PURE__*/React.createElement(FormattedMessage, messages.columnsButtonText);
    } else {
      columnsButtonText = /*#__PURE__*/React.createElement(FormattedMessage, _extends({
        values: {
          count: numberOfHiddenColumns
        }
      }, messages.columnsHiddenButtonText));
    }
    return /*#__PURE__*/React.createElement(Flyout, {
      className: "query-bar-column-dropdown-flyout",
      closeOnClick: true,
      closeOnClickOutside: true,
      onClose: this.onClose,
      onOpen: this.onOpen,
      position: "bottom-right"
    }, /*#__PURE__*/React.createElement(Button, {
      className: buttonClasses,
      isDisabled: template === undefined,
      onClick: this.toggleColumnButton,
      type: "button"
    }, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(IconMetadataColumns, null), /*#__PURE__*/React.createElement("span", {
      className: "button-label"
    }, columnsButtonText))), /*#__PURE__*/React.createElement(Overlay, null, isColumnMenuOpen ? /*#__PURE__*/React.createElement(ColumnButtonOverlay, {
      columns: columns,
      onColumnChange: onColumnChange
    }) : /*#__PURE__*/React.createElement("div", null)));
  }
}
export default ColumnButton;
//# sourceMappingURL=ColumnButton.js.map