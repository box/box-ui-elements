const _excluded = ["children", "features", "history"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { MemoryRouter, Router } from 'react-router';
import { isFeatureEnabled } from '../feature-checking';
const NavRouter = _ref => {
  let {
      children,
      features,
      history
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const isRouterDisabled = isFeatureEnabled(features, 'routerDisabled.value');
  if (isRouterDisabled) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, children);
  }
  if (history) {
    return /*#__PURE__*/React.createElement(Router, {
      history: history
    }, children);
  }
  return /*#__PURE__*/React.createElement(MemoryRouter, rest, children);
};
export default NavRouter;
//# sourceMappingURL=NavRouter.js.map