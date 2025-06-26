import * as React from 'react';
import NavRouter from './NavRouter';
import { WithNavRouterProps } from './types';
import { isFeatureEnabled } from '../feature-checking';

const withNavRouter = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithNavRouterProps> => {
    function WithNavRouter({ history, initialEntries, ...rest }: P & WithNavRouterProps) {
        const { features } = rest;
        const isRouterDisabled = isFeatureEnabled(features, 'routerDisabled.value');
        
        if (isRouterDisabled) {
            return <Component {...(rest as P)} />;
        }

        return (
            <NavRouter history={history} initialEntries={initialEntries} features={features}>
                <Component {...(rest as P)} />
            </NavRouter>
        );
    }

    WithNavRouter.displayName = `withNavRouter(${Component.displayName || Component.name || 'Component'}`;

    return WithNavRouter;
};

export default withNavRouter;
