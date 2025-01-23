import * as React from 'react';

/** @type {React.Context<import('./flowTypes').ContextRouter>} */
const RouterContext = React.createContext({
    history: {
        push: () => {},
        replace: () => {},
        go: () => {},
        goBack: () => {},
        goForward: () => {},
        listen: () => () => {},
        block: () => () => {},
        createHref: () => '',
        location: { pathname: '/', search: '', hash: '', state: null },
        action: 'POP',
        length: 1,
    },
    location: { pathname: '/', search: '', hash: '', state: null },
    match: { params: {}, path: '/', url: '/', isExact: true },
});

export { RouterContext };
