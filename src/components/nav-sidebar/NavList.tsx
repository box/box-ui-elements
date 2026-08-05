import * as React from 'react';
import classNames from 'classnames';

export interface NavListProps {
    /** Navigation links to render as list items */
    children: React.ReactNode;
    /** Custom class name for the navigation list */
    className?: string;
    /** Whether the navigation list is collapsed */
    collapsed?: boolean;
    /** Heading displayed above the navigation links */
    heading?: React.ReactNode;
    /** Content displayed before the navigation links */
    placeholder?: React.ReactNode;
    /** Properties passed to the underlying unordered list */
    ulProps?: React.HTMLProps<HTMLUListElement> & Record<string, unknown>;
}

const NavList = ({ children, className = '', collapsed = false, heading, placeholder, ulProps = {} }: NavListProps) => {
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
