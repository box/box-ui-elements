import * as React from 'react';

import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import PlainButton from '../plain-button';

export interface EllipsisCrumbProps {
    /** Breadcrumb items displayed in the overflow menu */
    children: React.ReactElement | React.ReactElement[];
    /** Element used to open the overflow menu */
    menuButton?: React.ReactElement;
}

const EllipsisCrumb = ({ children, menuButton }: EllipsisCrumbProps) => {
    const defaultMenuButton = <PlainButton className="breadcrumb-toggler">⋯</PlainButton>;
    return (
        <DropdownMenu>
            {menuButton || defaultMenuButton}
            <Menu>{children}</Menu>
        </DropdownMenu>
    );
};

export default EllipsisCrumb;
