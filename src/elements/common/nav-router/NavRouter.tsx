import * as React from 'react';
import { MemoryRouter, Router } from 'react-router';
import { History } from 'history';
import { isFeatureEnabled, type FeatureConfig } from '../feature-checking';

type Props = {
    children: React.ReactNode;
    features?: FeatureConfig;
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};

const NavRouter = ({ children, features, history, ...rest }: Props) => {
    const isRouterDisabled = isFeatureEnabled(features, 'routerDisabled.value');
    
    if (isRouterDisabled) {
        return <>{children}</>;
    }

    if (history) {
        return <Router history={history}>{children}</Router>;
    }

    return <MemoryRouter {...rest}>{children}</MemoryRouter>;
};

export default NavRouter;
