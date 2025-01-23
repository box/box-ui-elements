import * as React from 'react';
import { createBrowserHistory, createMemoryHistory } from 'history';
import Router from './Router';

/**
 * @typedef {Object} Props
 * @property {React.ReactNode} children
 * @property {Object} [history]
 * @property {string[]} [initialEntries]
 */

/** @type {React.FC<Props>} */
const CustomRouter = ({ children, history: providedHistory, initialEntries, location, match }) => {
    const history =
        providedHistory || (initialEntries ? createMemoryHistory({ initialEntries }) : createBrowserHistory());
    return (
        <Router history={history} location={location} match={match}>
            {children}
        </Router>
    );
};

export default CustomRouter;
