function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { Route } from 'react-router-dom';

// Basically a workaround for the fact that react-router's withRouter cannot forward ref's through
// functional components. Use this instead to gain the benefits of withRouter but also ref forwarding
export default function withRouterAndRef(Wrapped) {
  const WithRouterAndRef = /*#__PURE__*/React.forwardRef((props, ref) => {
    const {
      routerDisabled
    } = props;

    // If router is disabled, return component directly without Route wrapper
    if (routerDisabled) {
      return /*#__PURE__*/React.createElement(Wrapped, _extends({
        ref: ref
      }, props));
    }

    // Default behavior: wrap with Route to get router props
    return /*#__PURE__*/React.createElement(Route, null, routeProps => /*#__PURE__*/React.createElement(Wrapped, _extends({
      ref: ref
    }, routeProps, props)));
  });
  const name = Wrapped.displayName || Wrapped.name || 'Component';
  WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
  return WithRouterAndRef;
}
//# sourceMappingURL=withRouterAndRef.js.map