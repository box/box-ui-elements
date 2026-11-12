import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import type { match } from 'react-router';
import type { Location } from 'history';
import PlainButton, { PlainButtonProps } from '../../../components/plain-button';
import { isLeftClick } from '../../../utils/dom';

export interface NavButtonProps {
    activeClassName?: string;
    children: React.ReactNode;
    className?: string;
    component?: React.ComponentType<PlainButtonProps & { ref?: React.Ref<HTMLButtonElement> }>;
    exact?: boolean;
    isActive?: (match: match, location: Location) => boolean;
    isDisabled?: boolean;
    onClick?: (event: React.SyntheticEvent) => void;
    replace?: boolean;
    strict?: boolean;
    to: string | Location;
}

const NavButton = React.forwardRef<HTMLButtonElement, NavButtonProps>(
    (props: NavButtonProps, ref: React.Ref<HTMLButtonElement>) => {
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
    },
);

export default NavButton;
