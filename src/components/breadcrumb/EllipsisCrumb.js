// @flow
import * as React from 'react';

import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import PlainButton from '../plain-button';

type Props = {
    children: React.Node,
    menuButton?: React.Node,
};

const EllipsisCrumb = ({ children, menuButton }: Props) => {
    const defaultMenuButton = <PlainButton className="breadcrumb-toggler">⋯</PlainButton>;
    return (
        <DropdownMenu>
            {menuButton || defaultMenuButton}
            <Menu>{children}</Menu>
        </DropdownMenu>
    );
};

export default EllipsisCrumb;
