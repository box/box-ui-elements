import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { isFeatureEnabled } from '../feature-checking';
export default function withRouterIfEnabled(Wrapped) {
  const WrappedWithRouter = withRouter(Wrapped);
  const WithRouterIfEnabled = props => {
    const routerDisabled = props?.routerDisabled === true || isFeatureEnabled(props?.features, 'routerDisabled.value');
    const Component = routerDisabled ? Wrapped : WrappedWithRouter;
    return /*#__PURE__*/React.createElement(Component, props);
  };
  const name = Wrapped.displayName || Wrapped.name || 'Component';
  WithRouterIfEnabled.displayName = `withRouterIfEnabled(${name})`;
  return WithRouterIfEnabled;
}
//# sourceMappingURL=withRouterIfEnabled.js.map