/**
 * @file Nav Button component intended to mimic React Router's NavLink component for non-anchor elements
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import type { match } from 'react-router-dom';
import type { Location } from 'history';
import PlainButton from '../../../components/plain-button';
import { isLeftClick } from '../../../utils/dom';

interface Props {
    activeClassName?: string;
    children: React.ReactNode;
    className?: string;
    component?: React.ComponentType<
        React.HTMLAttributes<HTMLElement> & { isDisabled?: boolean; getDOMRef?: React.LegacyRef<HTMLButtonElement> }
    >;
    exact?: boolean;
    isActive?: (match: match, location: Location) => boolean | null | undefined;
    isDisabled?: boolean;
    onClick?: (event: React.SyntheticEvent) => void;
    replace?: boolean;
    strict?: boolean;
    to: string | Location;
}

const NavButton = React.forwardRef<HTMLButtonElement, Props>(
    (props: Props, ref: React.LegacyRef<HTMLButtonElement>) => {
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
            <Route exact={exact} path={path} strict={strict}>
                {({ history, location, match }) => {
                    const isActiveValue = !!(isActive ? isActive(match, location) : match);

                    return (
                        <Component
                            className={classNames(className, {
                                [activeClassName]: isActiveValue,
                                [disabledClassName]: isDisabled,
                            })}
                            isDisabled={isDisabled}
                            onClick={(event: React.SyntheticEvent) => {
                                if (onClick) {
                                    onClick(event);
                                }

                                if (!event.defaultPrevented && isLeftClick(event)) {
                                    const method = replace ? history.replace : history.push;
                                    method(to);
                                }
                            }}
                            getDOMRef={ref}
                            {...rest}
                        >
                            {children}
                        </Component>
                    );
                }}
            </Route>
        );
    },
);

export default NavButton;
