import * as React from 'react';

import MenuItem from './MenuItem';

export interface MenuSectionHeaderProps {
    /** children - menu section header content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class name for the menu section header */
    className?: string;
}

const MenuSectionHeader = ({ className = '', ...rest }: MenuSectionHeaderProps) => (
    <MenuItem className={`menu-section-header ${className}`} isDisabled {...rest} />
);

export default MenuSectionHeader;
