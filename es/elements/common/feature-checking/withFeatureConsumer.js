function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
function withFeatureConsumer(WrappedComponent) {
  function wrapComponent(props, ref) {
    return /*#__PURE__*/React.createElement(FeatureConsumer, null, features => /*#__PURE__*/React.createElement(WrappedComponent, _extends({}, props, {
      ref: ref,
      features: features
    })));
  }
  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
  wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
  return /*#__PURE__*/React.forwardRef(wrapComponent);
}
export default withFeatureConsumer;
//# sourceMappingURL=withFeatureConsumer.js.map