import React from 'react';
import { History } from 'history';
import { MemoryRouterProps } from 'react-router';
import NavRouter from '.';

export type WithNavRouterProps = {
    history?: History;
} & MemoryRouterProps;

export const withNavRouter = <P extends object>(
    Component: React.ComponentType<P>,
): React.FC<P & WithNavRouterProps> => {
    function WithNavRouter({
        getUserConfirmation,
        history,
        initialEntries,
        initialIndex,
        keyLength,
        ...rest
    }: P & WithNavRouterProps) {
        return (
            <NavRouter
                getUserConfirmation={getUserConfirmation}
                history={history}
                initialEntries={initialEntries}
                initialIndex={initialIndex}
                keyLength={keyLength}
            >
                <Component {...(rest as P)} />
            </NavRouter>
        );
    }

    WithNavRouter.displayName = `withNavRouter(${Component.displayName || Component.name || 'Component'}`;

    return WithNavRouter;
};
