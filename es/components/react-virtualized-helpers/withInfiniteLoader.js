const _excluded = ["infiniteLoaderProps"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import InfiniteLoader from '@box/react-virtualized/dist/commonjs/InfiniteLoader';
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function withInfiniteLoader(WrappedComponent) {
  const InfiniteLoaderComponent = _ref => {
    let {
        infiniteLoaderProps: {
          isRowLoaded,
          loadMoreRows,
          minimumBatchSize,
          rowCount,
          threshold
        }
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
    return /*#__PURE__*/React.createElement(InfiniteLoader, {
      isRowLoaded: isRowLoaded,
      loadMoreRows: loadMoreRows,
      minimumBatchSize: minimumBatchSize,
      rowCount: rowCount,
      threshold: threshold
    }, ({
      onRowsRendered,
      registerChild
    }) => /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, rest, {
      ref: registerChild,
      onRowsRendered: onRowsRendered
    })));
  };
  InfiniteLoaderComponent.displayName = `WithInfiniteLoader(${getDisplayName(WrappedComponent)})`;
  return InfiniteLoaderComponent;
}
export default withInfiniteLoader;
//# sourceMappingURL=withInfiniteLoader.js.map