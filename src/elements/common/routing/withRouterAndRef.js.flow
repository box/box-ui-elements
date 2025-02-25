// @flow
import * as React from 'react';
import { Route } from 'react-router-dom';

// Basically a workaround for the fact that react-router's withRouter cannot forward ref's through
// functional components. Use this instead to gain the benefits of withRouter but also ref forwarding
export default function withRouterAndRef(Wrapped: React.ComponentType<any>) {
    const WithRouterAndRef = React.forwardRef<Object, React.Ref<any>>((props, ref) => (
        <Route>{routeProps => <Wrapped ref={ref} {...routeProps} {...props} />}</Route>
    ));
    const name = Wrapped.displayName || Wrapped.name || 'Component';
    WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
    return WithRouterAndRef;
}
