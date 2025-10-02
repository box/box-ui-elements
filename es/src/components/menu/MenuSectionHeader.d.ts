import * as React from 'react';
export interface MenuSectionHeaderProps {
    /** children - menu section header content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class name for the menu section header */
    className?: string;
}
declare const MenuSectionHeader: ({ className, ...rest }: MenuSectionHeaderProps) => React.JSX.Element;
export default MenuSectionHeader;
