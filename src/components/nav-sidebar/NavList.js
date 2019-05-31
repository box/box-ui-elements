// @flow
import * as React from 'react';
import classNames from 'classnames';

import AnimateHeight from 'react-animate-height';

type Props = {
    children: React.Node,
    className?: string,
    collapsed?: boolean,
    enableAnimation?: boolean,
    heading?: React.Node,
    placeholder?: React.Node,
    ulProps?: Object,
};

const NavList = ({
    children,
    className = '',
    collapsed = false,
    enableAnimation = false,
    heading,
    placeholder,
    ulProps = {},
}: Props) => {
    const classes = classNames(`nav-list`, className, {
        'is-animation-enabled': enableAnimation,
        'is-collapsed': collapsed,
    });

    const childrenParsed = React.Children.map(children, link => (link ? <li>{link}</li> : null));

    return (
        <nav className={classes}>
            {heading ? <h2>{heading}</h2> : null}
            {placeholder}
            <ul {...ulProps}>
                {enableAnimation && children ? (
                    <AnimateHeight duration={300} height={!collapsed ? 'auto' : 0}>
                        {childrenParsed}
                    </AnimateHeight>
                ) : (
                    childrenParsed
                )}
            </ul>
        </nav>
    );
};

export default NavList;
