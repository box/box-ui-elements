// @flow
import * as React from 'react';

import MenuItem from './MenuItem';

type Props = {
    children: React.Node,
    className?: string,
};

const MenuSectionHeader = ({ className = '', ...rest }: Props) => (
    <MenuItem className={`menu-section-header ${className}`} isDisabled {...rest} />
);

export default MenuSectionHeader;
