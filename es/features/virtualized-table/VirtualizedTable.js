const _excluded = ["children", "height", "intl"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { AutoSizer } from '@box/react-virtualized/dist/es/AutoSizer/index';
import { WindowScroller } from '@box/react-virtualized/dist/es/WindowScroller/index';
import BaseVirtualizedTable from './BaseVirtualizedTable';
import './VirtualizedTable.scss';
const VirtualizedTable = _ref => {
  let {
      children,
      height,
      intl
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(AutoSizer, {
    defaultHeight: height,
    disableHeight: true
  }, ({
    width
  }) => height ? /*#__PURE__*/React.createElement(BaseVirtualizedTable, _extends({
    height: height,
    width: width
  }, rest), typeof children === 'function' ? children(intl) : children) : /*#__PURE__*/React.createElement(WindowScroller, null, ({
    height: dynamicHeight,
    isScrolling,
    onChildScroll,
    scrollTop
  }) => /*#__PURE__*/React.createElement(BaseVirtualizedTable, _extends({
    autoHeight: true,
    height: dynamicHeight,
    isScrolling: isScrolling,
    onScroll: onChildScroll,
    scrollTop: scrollTop,
    width: width
  }, rest), typeof children === 'function' ? children(intl) : children)));
};
export default injectIntl(VirtualizedTable);
//# sourceMappingURL=VirtualizedTable.js.map