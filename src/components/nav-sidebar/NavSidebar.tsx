import * as React from 'react';

import './NavSidebar.scss';

export interface NavSidebarProps extends React.HTMLAttributes<HTMLElement> {
    /** Contents of the navigation sidebar */
    children: React.ReactNode;
    /** Custom class name for the navigation sidebar */
    className?: string;
}

const NavSidebar = ({ children, className = '', ...rest }: NavSidebarProps) => (
    <aside className={`nav-sidebar ${className}`} {...rest}>
        {children}
    </aside>
);

export default NavSidebar;
