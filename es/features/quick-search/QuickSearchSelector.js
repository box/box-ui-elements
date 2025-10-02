const _excluded = ["className", "inputProps", "inputRef", "isLoading", "onInput", "placeholder"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import LoadingIndicator from '../../components/loading-indicator';
import './QuickSearchSelector.scss';
const QuickSearchSelector = _ref => {
  let {
      className,
      inputProps = {},
      inputRef,
      isLoading = false,
      onInput,
      placeholder
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("div", {
    className: "quick-search-selector"
  }, /*#__PURE__*/React.createElement("input", _extends({}, rest, inputProps, {
    ref: inputRef,
    "aria-label": placeholder,
    autoComplete: "off",
    className: classNames('search-input', className),
    onInput: onInput,
    placeholder: placeholder,
    type: "text"
  })), isLoading && /*#__PURE__*/React.createElement(LoadingIndicator, {
    className: "loading-indicator"
  }));
};
QuickSearchSelector.displayName = 'QuickSearchSelector';
export default QuickSearchSelector;
//# sourceMappingURL=QuickSearchSelector.js.map