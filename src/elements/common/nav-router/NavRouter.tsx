import * as React from 'react';
import type { History } from '../routing/flowTypes';
import CustomRouter from '../routing/customRouter';

type Props = {
    children: React.ReactNode;
    history?: History;
    initialEntries?: string[];
};

const NavRouter = ({ children, history, ...rest }: Props) => {
    // Convert history to match CustomRouter's expected type
    const routerHistory = history
        ? {
              ...history,
              scrollRestoration: 'auto',
              state: {},
              back: history.back,
              forward: history.forward,
          }
        : undefined;

    return (
        <CustomRouter history={routerHistory} {...rest}>
            {children}
        </CustomRouter>
    );
};

export default NavRouter;
