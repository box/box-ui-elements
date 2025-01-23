import * as React from 'react';
import { RouterContext } from './RouterContext';

/**
 * @template P
 * @param {React.ComponentType<P & import('./flowTypes').ContextRouter>} Component
 * @returns {React.ComponentType<P>}
 */
const withRouter = Component => {
    const WithRouter = props => (
        <RouterContext.Consumer>{context => <Component {...props} {...context} />}</RouterContext.Consumer>
    );

    WithRouter.displayName = `withRouter(${Component.displayName || Component.name})`;
    return WithRouter;
};

export default withRouter;
