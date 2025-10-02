import * as React from 'react';
import './MenuHeader.scss';
export interface MenuHeaderProps {
    /** className - CSS class name for the menu section header */
    className?: string;
    /** children - menu section header content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** subtitle - Secondary title of header below Title */
    subtitle?: React.ReactChild;
    /** title - Title of header */
    title?: React.ReactChild;
}
declare const MenuHeader: ({ className, children, subtitle, title, ...rest }: MenuHeaderProps) => React.JSX.Element;
export default MenuHeader;
