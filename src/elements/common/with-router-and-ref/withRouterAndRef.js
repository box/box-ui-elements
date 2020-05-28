// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';

export default function withRouterAndRef(Wrapped: React.ComponentType<any>) {
    const WithRouter = withRouter(({ forwardRef, ...otherProps }) => <Wrapped ref={forwardRef} {...otherProps} />);
    const WithRouterAndRef = React.forwardRef<Object, React.Ref<any>>((props, ref) => (
        <WithRouter {...props} forwardRef={ref} />
    ));
    const name = Wrapped.displayName || Wrapped.name || 'Component';
    WithRouterAndRef.displayName = `withRouterAndRef(${name})`;
    return WithRouterAndRef;
}
