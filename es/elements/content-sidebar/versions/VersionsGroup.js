const _excluded = ["heading"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Versions Group component
 * @author Box
 */

import * as React from 'react';
import VersionsList from './VersionsList';
import './VersionsGroup.scss';
const VersionsGroup = _ref => {
  let {
      heading
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("section", {
    className: "bcs-VersionsGroup"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "bcs-VersionsGroup-heading"
  }, heading), /*#__PURE__*/React.createElement(VersionsList, rest));
};
export default VersionsGroup;
//# sourceMappingURL=VersionsGroup.js.map