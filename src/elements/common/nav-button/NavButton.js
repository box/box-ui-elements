/**
 * @flow
 * @file Nav Button component intended to mimic React Router's NavLink component for non-anchor elements
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import PlainButton from '../../../components/plain-button';

type Props = {
    activeClassName?: string,
    children: React.Node,
    className?: string,
    component?: React.ComponentType<any>,
    exact?: boolean,
    onClick?: (event: SyntheticEvent<>) => void,
    replace?: boolean,
    strict?: boolean,
    to: string | Location,
};

const NavButton = ({
    activeClassName = 'bdl-is-active',
    children,
    className = 'bdl-NavButton',
    component: Component = PlainButton,
    exact,
    onClick,
    replace,
    strict,
    to,
    ...rest
}: Props) => {
    const path = typeof to === 'object' ? to.pathname : to;

    return (
        <Route exact={exact} path={path} strict={strict}>
            {({ history, match }) => (
                <Component
                    className={classNames(className, { [activeClassName]: !!match })}
                    onClick={event => {
                        const method = replace ? history.replace : history.push;

                        if (onClick) {
                            onClick(event);
                        }

                        method(path);
                    }}
                    {...rest}
                >
                    {children}
                </Component>
            )}
        </Route>
    );
};

export default NavButton;
