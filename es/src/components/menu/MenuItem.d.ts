import * as React from 'react';
import './MenuItem.scss';
export interface MenuItemProps {
    /** 'aria-checked' - ARIA attribute for checkbox elements */
    'aria-checked'?: boolean;
    /** 'aria-disabled' - ARIA attribute describing whether the menu item is disabled */
    'aria-disabled'?: boolean | 'true' | 'false';
    /** children - menu item content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class name for the menu item */
    className?: string;
    /** isDisabled - whether the menu item is disabled */
    isDisabled?: boolean;
    /** isSelectItem - whether the menu item is a checkbox element */
    isSelectItem?: boolean;
    /** isSelected - whether the menu item is selected */
    isSelected?: boolean;
    /** onClick - function called when the menu item is clicked */
    onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    /** role - ARIA role for the menu item */
    role?: string;
    /** showRadar - whether the radar component is shown */
    showRadar?: boolean;
    /** tabIndex - indicator of whether the menu item is focusable */
    tabIndex?: number;
}
declare class MenuItem extends React.Component<MenuItemProps> {
    onClickHandler: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    render(): React.JSX.Element;
}
export default MenuItem;
