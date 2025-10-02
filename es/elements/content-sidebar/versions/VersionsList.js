const _excluded = ["currentId", "internalSidebarNavigation", "routerDisabled", "versions"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Versions List component
 * @author Box
 */

import * as React from 'react';
import { Route } from 'react-router-dom';
import VersionsItem from './VersionsItem';
import './VersionsList.scss';
const VersionsList = _ref => {
  let {
      currentId,
      internalSidebarNavigation,
      routerDisabled = false,
      versions
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const renderVersionItemWithoutRouter = version => /*#__PURE__*/React.createElement(VersionsItem, _extends({
    isCurrent: currentId === version.id,
    isSelected: internalSidebarNavigation?.versionId === version.id,
    version: version
  }, rest));
  const renderVersionItemWithRouter = version => /*#__PURE__*/React.createElement(Route, {
    render: ({
      match
    }) => /*#__PURE__*/React.createElement(VersionsItem, _extends({
      isCurrent: currentId === version.id,
      isSelected: match.params.versionId === version.id,
      version: version
    }, rest))
  });
  return /*#__PURE__*/React.createElement("ul", {
    className: "bcs-VersionsList"
  }, versions.map(version => /*#__PURE__*/React.createElement("li", {
    className: "bcs-VersionsList-item",
    key: version.id
  }, routerDisabled ? renderVersionItemWithoutRouter(version) : renderVersionItemWithRouter(version))));
};
export default VersionsList;
//# sourceMappingURL=VersionsList.js.map