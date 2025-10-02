// @flow
import * as React from 'react';
import classNames from 'classnames';

type Props = {
    children: React.Node,
    className?: string,
    collapsed?: boolean,
    heading?: React.Node,
    placeholder?: React.Node,
    ulProps?: Object,
};

const NavList = ({ children, className = '', collapsed = false, heading, placeholder, ulProps = {} }: Props) => {
    const classes = classNames(`nav-list`, className, {
        'is-collapsed': collapsed,
    });

    return (
        <nav className={classes}>
            {heading ? <h2>{heading}</h2> : null}
            {placeholder}
            <ul {...ulProps}>{React.Children.map(children, link => (link ? <li>{link}</li> : null))}</ul>
        </nav>
    );
};

export default NavList;
