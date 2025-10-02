const _excluded = ["action", "className", "innerRef", "intl", "isLoading", "method", "name", "queryParams", "onSubmit", "useClearButton"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import omit from 'lodash/omit';

// $FlowFixMe
import SearchActions from './SearchActions';

// $FlowFixMe
import messages from './messages';
import './SearchForm.scss';
class SearchFormBase extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isEmpty: true
    });
    _defineProperty(this, "onClearHandler", event => {
      const {
        onChange,
        shouldPreventClearEventPropagation
      } = this.props;
      if (shouldPreventClearEventPropagation) {
        event.stopPropagation();
      }
      if (this.searchInput) {
        this.searchInput.value = '';
      }
      this.setState({
        isEmpty: true
      });
      if (onChange) {
        onChange('');
      }
    });
    _defineProperty(this, "onChangeHandler", ({
      target
    }) => {
      const {
        value
      } = target;
      const {
        onChange
      } = this.props;
      this.setState({
        isEmpty: !value || !value.trim().length
      });
      if (onChange) {
        onChange(value);
      }
    });
    _defineProperty(this, "onSubmitHandler", event => {
      const {
        value
      } = event.target.elements[0];
      const {
        onSubmit
      } = this.props;
      if (onSubmit) {
        onSubmit(value, event);
      }
    });
    _defineProperty(this, "setInputRef", element => {
      this.searchInput = element;
      if (this.props.getSearchInput) {
        this.props.getSearchInput(this.searchInput);
      }
    });
  }
  static getDerivedStateFromProps(props) {
    const {
      value
    } = props;
    if (value && !!value.trim()) {
      return {
        isEmpty: true
      };
    }
    return null;
  }
  render() {
    const _this$props = this.props,
      {
        action,
        className,
        innerRef,
        intl,
        isLoading,
        method,
        name,
        queryParams,
        onSubmit,
        useClearButton
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      isEmpty
    } = this.state;
    const inputProps = omit(rest, ['getSearchInput', 'onChange', 'onSubmit', 'required', 'shouldPreventClearEventPropagation']);
    const {
      formatMessage
    } = intl;
    const classes = classNames(className, 'search-input-container');
    const formClassNames = classNames('search-form', {
      'is-empty': isEmpty,
      'use-clear-button': useClearButton
    });
    const hiddenInputs = Object.keys(queryParams).map((param, index) => /*#__PURE__*/React.createElement("input", {
      key: index,
      name: param,
      type: "hidden",
      value: queryParams[param]
    }));

    // @NOTE Prevent errors from React about controlled inputs
    const onChangeStub = () => {};
    return /*#__PURE__*/React.createElement("div", {
      ref: innerRef,
      className: classes
    }, /*#__PURE__*/React.createElement("form", {
      action: action,
      className: formClassNames,
      method: method,
      onChange: this.onChangeHandler,
      onSubmit: this.onSubmitHandler,
      role: "search"
    }, /*#__PURE__*/React.createElement("input", _extends({
      ref: this.setInputRef,
      "aria-label": formatMessage(messages.searchLabel),
      autoComplete: "off",
      className: "search-input",
      name: name,
      onChange: onChangeStub,
      type: "search"
    }, inputProps)), /*#__PURE__*/React.createElement(SearchActions, {
      hasSubmitAction: !!onSubmit,
      isLoading: isLoading,
      loadingIndicatorProps: {
        className: 'search-form-loading-indicator'
      },
      onClear: this.onClearHandler
    }), hiddenInputs));
  }
}
_defineProperty(SearchFormBase, "defaultProps", {
  action: '',
  method: 'get',
  name: 'search',
  queryParams: {},
  useClearButton: false
});
const SearchFormBaseIntl = injectIntl(SearchFormBase);
export { SearchFormBaseIntl };
const SearchForm = /*#__PURE__*/React.forwardRef((props, ref) => /*#__PURE__*/React.createElement(SearchFormBaseIntl, _extends({}, props, {
  innerRef: ref
})));
SearchForm.displayName = 'SearchForm';
export default SearchForm;
//# sourceMappingURL=SearchForm.js.map