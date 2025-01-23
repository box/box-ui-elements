/**
 * @flow
 * @file Nav Button component intended to mimic React Router's NavLink component for non-anchor elements
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { RouterContext } from '../routing/RouterContext';
import { matchPath } from '../routing/utils';
import PlainButton from '../../../components/plain-button';
import { isLeftClick } from '../../../utils/dom';

const NavButton = React.forwardRef(
    (
        props: {
            activeClassName?: string,
            children: React.Node,
            className?: string,
            component?: React.ComponentType<any>,
            exact?: boolean,
            isActive?: (match: Object, location: Object) => ?boolean,
            isDisabled?: boolean,
            onClick?: (event: SyntheticEvent<>) => void,
            replace?: boolean,
            strict?: boolean,
            to: string | Object,
        },
        ref,
    ) => {
        const {
            activeClassName = 'bdl-is-active',
            children,
            className = 'bdl-NavButton',
            component: Component = PlainButton,
            exact,
            isActive,
            isDisabled,
            onClick,
            replace,
            strict,
            to,
            ...rest
        } = props;

        const path = typeof to === 'object' ? to.pathname : to;
        const disabledClassName = 'bdl-is-disabled';

        return (
            <RouterContext.Consumer>
                {({ history, location }) => {
                    const match = matchPath(location.pathname, { path, exact, strict });
                    const isActiveValue = !!(isActive ? isActive(match, location) : match);
                    const handleClick = event => {
                        if (onClick) {
                            onClick(event);
                        }

                        if (!event.defaultPrevented && isLeftClick(event)) {
                            const method = replace ? history.replace : history.push;
                            method(to);
                        }
                    };

                    return (
                        <Component
                            className={classNames(className, {
                                [activeClassName]: isActiveValue,
                                [disabledClassName]: isDisabled,
                            })}
                            isDisabled={isDisabled}
                            onClick={handleClick}
                            ref={ref}
                            {...rest}
                        >
                            {children}
                        </Component>
                    );
                }}
            </RouterContext.Consumer>
        );
    },
);

export default NavButton;
