function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import SelectorDropdown from '../../components/selector-dropdown';
import QuickSearchMessage from './QuickSearchMessage';
import QuickSearchSelector from './QuickSearchSelector';
import './QuickSearch.scss';
class QuickSearch extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleFocus", () => {
      this.setState({
        showMessage: true
      });
    });
    _defineProperty(this, "handleBlur", () => {
      this.setState({
        showMessage: false
      });
    });
    this.state = {
      showMessage: false
    };
  }
  render() {
    const {
      children,
      className,
      dividerIndex,
      errorMessage,
      inputProps,
      noItemsMessage,
      onSelect,
      title
    } = this.props;
    const {
      showMessage
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: classNames('quick-search', className),
      onBlur: this.handleBlur,
      onFocus: this.handleFocus
    }, /*#__PURE__*/React.createElement(SelectorDropdown, {
      dividerIndex: dividerIndex,
      onSelect: onSelect,
      selector: /*#__PURE__*/React.createElement(QuickSearchSelector, inputProps),
      title: title
    }, children), !!errorMessage && /*#__PURE__*/React.createElement(QuickSearchMessage, {
      isShown: showMessage
    }, errorMessage), !!noItemsMessage && /*#__PURE__*/React.createElement(QuickSearchMessage, {
      isShown: showMessage
    }, noItemsMessage));
  }
}
export default QuickSearch;
//# sourceMappingURL=QuickSearch.js.map