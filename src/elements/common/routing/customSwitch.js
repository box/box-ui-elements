import * as React from 'react';
import { RouterContext } from './RouterContext';
import { matchPath } from './utils';

/**
 * @typedef {Object} Props
 * @property {React.ReactNode} children
 */

/** @type {React.FC<Props>} */
const CustomSwitch = ({ children }) => (
    <RouterContext.Consumer>
        {({ location }) => {
            let element = null;
            React.Children.forEach(children, child => {
                if (!React.isValidElement(child)) {
                    return;
                }

                if (element) {
                    return;
                }

                const { path, exact, strict } = child.props;
                const match = matchPath(location.pathname, { path, exact, strict });

                if (match) {
                    element = child;
                }
            });

            return element;
        }}
    </RouterContext.Consumer>
);

export default CustomSwitch;
