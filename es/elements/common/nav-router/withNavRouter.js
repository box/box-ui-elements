const _excluded = ["history", "initialEntries"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import NavRouter from './NavRouter';
import { isFeatureEnabled } from '../feature-checking';
const withNavRouter = Component => {
  function WithNavRouter(_ref) {
    let {
        history,
        initialEntries
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
    const {
      features
    } = rest;
    const isRouterDisabled = isFeatureEnabled(features, 'routerDisabled.value');
    if (isRouterDisabled) {
      return /*#__PURE__*/React.createElement(Component, rest);
    }
    return /*#__PURE__*/React.createElement(NavRouter, {
      history: history,
      initialEntries: initialEntries,
      features: features
    }, /*#__PURE__*/React.createElement(Component, rest));
  }
  WithNavRouter.displayName = `withNavRouter(${Component.displayName || Component.name || 'Component'}`;
  return WithNavRouter;
};
export default withNavRouter;
//# sourceMappingURL=withNavRouter.js.map