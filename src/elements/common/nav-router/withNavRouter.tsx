import React from 'react';
import NavRouter from './NavRouter';
import { WithNavRouterProps } from './types';

const withNavRouter = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithNavRouterProps> => {
    function WithNavRouter({ history, initialEntries, ...rest }: P & WithNavRouterProps) {
        return (
            <NavRouter history={history} initialEntries={initialEntries}>
                <Component {...(rest as P)} />
            </NavRouter>
        );
    }

    WithNavRouter.displayName = `withNavRouter(${Component.displayName || Component.name || 'Component'}`;

    return WithNavRouter;
};

export default withNavRouter;
