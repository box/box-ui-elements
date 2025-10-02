const _excluded = ["isLoading", "loadingIndicatorProps"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import LoadingIndicator from './LoadingIndicator';
const makeLoadable = BaseComponent => {
  const LoadableComponent = _ref => {
    let {
        isLoading = false,
        loadingIndicatorProps = {}
      } = _ref,
      rest = _objectWithoutProperties(_ref, _excluded);
    return isLoading ? /*#__PURE__*/React.createElement(LoadingIndicator, loadingIndicatorProps) : /*#__PURE__*/React.createElement(BaseComponent, rest);
  };
  LoadableComponent.displayName = `Loadable${BaseComponent.displayName || BaseComponent.name || 'Component'}`;
  return LoadableComponent;
};
export default makeLoadable;
//# sourceMappingURL=makeLoadable.js.map