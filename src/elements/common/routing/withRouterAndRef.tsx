import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

// Basically a workaround for the fact that react-router's withRouter cannot forward ref's through
// functional components. Use this instead to gain the benefits of withRouter but also ref forwarding
export default function withRouterAndRef<P extends object, R = unknown>(
    Wrapped: React.ComponentType<P & RouteComponentProps>,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<R>> {
    const WithRouterAndRef = React.forwardRef<R, P>((props, ref) => (
        <Route>{routeProps => <Wrapped ref={ref} {...routeProps} {...props} />}</Route>
    ));
    const name = Wrapped.displayName || Wrapped.name || 'Component';
    WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
    return WithRouterAndRef;
}
