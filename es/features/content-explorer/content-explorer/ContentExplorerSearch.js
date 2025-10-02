function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import SearchForm from '../../../components/search-form';
import messages from '../messages';
class ContentExplorerSearch extends PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleChange", value => {
      const {
        onClearButtonClick,
        onInput
      } = this.props;
      if (onInput) {
        onInput(value);
      }
      if (onClearButtonClick && !value) {
        onClearButtonClick();
      }
    });
    _defineProperty(this, "handleSubmit", (value, event) => {
      const {
        onSubmit
      } = this.props;
      event.preventDefault();
      if (onSubmit) {
        onSubmit();
      }
    });
  }
  render() {
    const {
      intl,
      inputValue,
      searchInputProps
    } = this.props;
    return /*#__PURE__*/React.createElement(SearchForm, _extends({
      className: "content-explorer-search-container",
      onChange: this.handleChange,
      onSubmit: this.handleSubmit,
      placeholder: intl.formatMessage(messages.searchPlaceholder),
      useClearButton: true,
      value: inputValue
    }, searchInputProps));
  }
}
_defineProperty(ContentExplorerSearch, "propTypes", {
  intl: PropTypes.any,
  inputValue: PropTypes.string,
  onSubmit: PropTypes.func,
  onInput: PropTypes.func,
  onClearButtonClick: PropTypes.func,
  searchInputProps: PropTypes.object
});
_defineProperty(ContentExplorerSearch, "defaultProps", {
  inputValue: '',
  searchInputProps: {}
});
export { ContentExplorerSearch as ContentExplorerSearchBase };
export default injectIntl(ContentExplorerSearch);
//# sourceMappingURL=ContentExplorerSearch.js.map