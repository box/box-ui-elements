// @flow
import * as React from 'react';
import classNames from 'classnames';

import AnimateHeight from 'react-animate-height';

type Props = {
    children: React.Node,
    className?: string,
    collapsed?: boolean,
    heading?: React.Node,
    isAnimationEnabled?: boolean,
    onAnimationEnd?: () => void,
    onAnimationStart?: () => void,
    placeholder?: React.Node,
    ulProps?: Object,
};

const NavList = ({
    children,
    className = '',
    collapsed = false,
    isAnimationEnabled = false,
    heading,
    onAnimationEnd,
    onAnimationStart,
    placeholder,
    ulProps = {},
}: Props) => {
    const classes = classNames(`nav-list`, className, {
        'is-animationEnabled': isAnimationEnabled,
        'is-collapsed': collapsed,
    });

    const childrenParsed = React.Children.map(children, link => (link ? <li>{link}</li> : null));

    return (
        <nav className={classes}>
            {heading ? <h2>{heading}</h2> : null}
            {placeholder}
            <ul {...ulProps}>
                {isAnimationEnabled && children ? (
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
