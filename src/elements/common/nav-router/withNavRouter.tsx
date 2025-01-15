import * as React from 'react';
import { useNavRouter } from './NavRouter';
import type { WithNavRouterProps } from './types';

const withNavRouter = <P extends object>(
    WrappedComponent: React.ComponentType<P>,
): React.FC<Omit<P, keyof WithNavRouterProps>> => {
    const WithNavRouterComponent: React.FC<Omit<P, keyof WithNavRouterProps>> = props => {
        const routerProps = useNavRouter();
        return <WrappedComponent {...(props as P)} {...routerProps} />;
    };

    WithNavRouterComponent.displayName = `WithNavRouter(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return WithNavRouterComponent;
};

export default withNavRouter;
