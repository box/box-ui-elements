// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { isFeatureEnabled } from '../feature-checking';

export default function withRouterIfEnabled(Wrapped: React.ComponentType<any>) {

    const WithRouterIfEnabled = (props: any) => {
        const routerDisabled =
            props?.routerDisabled === true || isFeatureEnabled(props?.features, 'routerDisabled.value');

        const Component = routerDisabled ? Wrapped : withRouter(Wrapped);

        return <Component {...props} />;
    };

    const name = Wrapped.displayName || Wrapped.name || 'Component';
    WithRouterIfEnabled.displayName = `withRouterIfEnabled(${name})`;

    return WithRouterIfEnabled;
}

