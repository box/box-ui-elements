// @flow
import * as React from 'react';

import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import PlainButton from '../plain-button';

type Props = {
    children: React.Node,
};

const EllipsisCrumb = ({ children }: Props) => (
    <DropdownMenu>
        <PlainButton className="breadcrumb-toggler">⋯</PlainButton>
        <Menu>{children}</Menu>
    </DropdownMenu>
);

export default EllipsisCrumb;
