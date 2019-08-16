/**
 * @flow
 * @file Nav Button component intended to mimic React Router's NavLink component for non-anchor elements
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import type { Match, Location } from 'react-router-dom';
import PlainButton from '../../../components/plain-button';
import { isLeftClick } from '../../../utils/dom';

type Props = {
    activeClassName?: string,
    children: React.Node,
    className?: string,
    component?: React.ComponentType<any>,
    exact?: boolean,
    isActive?: (match: Match, location: Location) => ?boolean,
    onClick?: (event: SyntheticEvent<>) => void,
    replace?: boolean,
    strict?: boolean,
    to: string | Location,
};

const NavButton = React.forwardRef<Props, React.Ref<any>>((props: Props, ref: React.Ref<any>) => {
    const {
        activeClassName = 'bdl-is-active',
        children,
        className = 'bdl-NavButton',
        component: Component = PlainButton,
        exact,
        isActive,
        onClick,
        replace,
        strict,
        to,
        ...rest
    } = props;
    const path = typeof to === 'object' ? to.pathname : to;

    return (
        <Route exact={exact} path={path} strict={strict}>
            {({ history, location, match }) => {
                const isActiveValue = !!(isActive ? isActive(match, location) : match);

                return (
                    <Component
                        className={classNames(className, { [activeClassName]: isActiveValue })}
                        onClick={event => {
                            if (onClick) {
                                onClick(event);
                            }

                            if (!event.defaultPrevented && isLeftClick(event)) {
                                const method = replace ? history.replace : history.push;
                                method(to);
                            }
                        }}
                        ref={ref}
                        {...rest}
                    >
                        {children}
                    </Component>
                );
            }}
        </Route>
    );
});

export default NavButton;
