const _excluded = ["hasNextMarker", "hasPrevMarker", "isSmall", "onMarkerBasedPageChange"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import MarkerBasedPagination from './MarkerBasedPagination';
import OffsetBasedPagination from './OffsetBasedPagination';
import './Pagination.scss';
const Pagination = _ref => {
  let {
      hasNextMarker,
      hasPrevMarker,
      isSmall,
      onMarkerBasedPageChange
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  if (hasNextMarker || hasPrevMarker) {
    return /*#__PURE__*/React.createElement(MarkerBasedPagination, {
      hasNextMarker: hasNextMarker,
      hasPrevMarker: hasPrevMarker,
      isSmall: isSmall,
      onMarkerBasedPageChange: onMarkerBasedPageChange
    });
  }
  return /*#__PURE__*/React.createElement(OffsetBasedPagination, _extends({
    isSmall: isSmall
  }, rest));
};
export default Pagination;
//# sourceMappingURL=Pagination.js.map