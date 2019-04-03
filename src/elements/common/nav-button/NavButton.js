/**
 * @flow
 * @file Nav Button component intended to mimic React Router's NavLink component for non-anchor elements
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
import PlainButton from '../../../components/plain-button';
import { KEYS } from '../../../constants';

type Props = {
    activeClassName?: string,
    children: React.Node,
    className?: string,
    component?: React.ComponentType<any>,
    exact?: boolean,
    onClick?: (event: SyntheticEvent<>) => void,
    onKeyPress?: (event: SyntheticEvent<>) => void,
    replace?: boolean,
    strict?: boolean,
    to: string | Location,
};

const isClickEvent = event => {
    return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

const isEnterEvent = event => {
    return event.key === KEYS.enter;
};

const NavButton = React.forwardRef<Props, React.Ref<any>>((props: Props, ref: React.Ref<any>) => {
    const {
        activeClassName = 'bdl-is-active',
        children,
        className = 'bdl-NavButton',
        component: Component = PlainButton,
        exact,
        onClick,
        onKeyPress,
        replace,
        strict,
        to,
        ...rest
    } = props;
    const path = typeof to === 'object' ? to.pathname : to;

    return (
        <Route exact={exact} path={path} strict={strict}>
            {({ history, match }) => {
                const navigate = () => {
                    const method = replace ? history.replace : history.push;
                    return method(path);
                };

                return (
                    <Component
                        className={classNames(className, { [activeClassName]: !!match })}
                        onClick={event => {
                            if (onClick) {
                                onClick(event);
                            }

                            if (!event.defaultPrevented && isClickEvent(event)) {
                                navigate();
                            }
                        }}
                        onKeyPress={event => {
                            if (onKeyPress) {
                                onKeyPress(event);
                            }

                            if (!event.defaultPrevented && isEnterEvent(event)) {
                                navigate();
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
