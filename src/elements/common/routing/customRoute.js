import * as React from 'react';
import { RouterContext } from './RouterContext';
import { matchPath } from './utils';

/**
 * @typedef {Object} Props
 * @property {React.ReactNode} children
 * @property {boolean} [exact]
 * @property {string} path
 * @property {boolean} [strict]
 * @property {Function} [render]
 */

/** @type {React.FC<Props>} */
const CustomRoute = ({ children, render, exact = false, strict = false, path, ...rest }) => {
    const routeRef = React.useRef(null);

    return (
        <RouterContext.Consumer>
            {context => {
                const match = path ? matchPath(context.location.pathname, { path, exact, strict }) : null;
                const props = {
                    ...context,
                    match,
                    ...rest,
                };

                if (typeof render === 'function') {
                    return render(props);
                }

                if (typeof children === 'function') {
                    return children(props);
                }

                if (!match && !children) {
                    return null;
                }

                return React.isValidElement(children)
                    ? React.cloneElement(children, { ref: routeRef, ...props })
                    : children;
            }}
        </RouterContext.Consumer>
    );
};

export default CustomRoute;
