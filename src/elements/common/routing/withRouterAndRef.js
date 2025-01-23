import * as React from 'react';
import CustomRoute from './customRoute';

// Basically a workaround for the fact that react-router's withRouter cannot forward ref's through
// functional components. Use this instead to gain the benefits of withRouter but also ref forwarding
export default function withRouterAndRef(Wrapped) {
    const WithRouterAndRef = React.forwardRef((props, ref) => (
        <CustomRoute>{routeProps => <Wrapped ref={ref} {...routeProps} {...props} />}</CustomRoute>
    ));
    const name = Wrapped.displayName || Wrapped.name || 'Component';
    WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
    return WithRouterAndRef;
}
