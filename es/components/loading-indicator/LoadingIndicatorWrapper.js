const _excluded = ["children", "className", "crawlerPosition", "crawlerSize", "isLoading", "hideContent"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classnames from 'classnames';
import LoadingIndicator, { LoadingIndicatorSize } from './LoadingIndicator';
import './LoadingIndicatorWrapper.scss';
export let LoadingIndicatorWrapperPosition = /*#__PURE__*/function (LoadingIndicatorWrapperPosition) {
  LoadingIndicatorWrapperPosition["CENTER"] = "center";
  LoadingIndicatorWrapperPosition["TOP"] = "top";
  return LoadingIndicatorWrapperPosition;
}({});
const LoadingIndicatorWrapper = _ref => {
  let {
      children,
      className = '',
      crawlerPosition = LoadingIndicatorWrapperPosition.CENTER,
      crawlerSize = LoadingIndicatorSize.DEFAULT,
      isLoading = false,
      hideContent = false
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const crawlerPositionClassName = classnames('loading-indicator-veil', {
    'is-with-top-crawler': crawlerPosition === LoadingIndicatorWrapperPosition.TOP,
    'is-with-center-crawler': crawlerPosition === LoadingIndicatorWrapperPosition.CENTER
  }, hideContent ? 'hide-content' : 'blur-content');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: `loading-indicator-wrapper ${className}`
  }, rest), children, isLoading && /*#__PURE__*/React.createElement("div", {
    className: crawlerPositionClassName
  }, /*#__PURE__*/React.createElement(LoadingIndicator, {
    size: crawlerSize
  })));
};
export default LoadingIndicatorWrapper;
//# sourceMappingURL=LoadingIndicatorWrapper.js.map