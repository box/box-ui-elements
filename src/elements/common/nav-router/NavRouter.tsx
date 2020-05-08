import * as React from 'react';
import { MemoryRouter, Router } from 'react-router';
import { History } from 'history';

type Props = {
    children: React.ReactNode;
    history?: History;
    initialEntries?: History.LocationDescriptor[];
};

const NavRouter = ({ children, history, ...rest }: Props) => {
    if (history) {
        return <Router history={history}>{children}</Router>;
    }

    return <MemoryRouter {...rest}>{children}</MemoryRouter>;
};

export default NavRouter;
