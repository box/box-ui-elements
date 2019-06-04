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
    onAnimationEnd?: () => void,
    onAnimationStart?: () => void,
    placeholder?: React.Node,
    ulProps?: Object,
};

const NavList = ({
    children,
    className = '',
    collapsed = false,
    enableAnimation = false,
    heading,
    onAnimationEnd,
    onAnimationStart,
    placeholder,
    ulProps = {},
}: Props) => {
    const classes = classNames(`nav-list`, className, {
        'is-animationEnabled': enableAnimation,
        'is-collapsed': collapsed,
    });

    const childrenParsed = React.Children.map(children, link => (link ? <li>{link}</li> : null));

    return (
        <nav className={classes}>
            {heading ? <h2>{heading}</h2> : null}
            {placeholder}
            <ul {...ulProps}>
                {enableAnimation && children ? (
                    <AnimateHeight
                        duration={200}
                        height={collapsed ? 0 : 'auto'}
                        onAnimationEnd={onAnimationEnd}
                        onAnimationStart={onAnimationStart}
                    >
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
