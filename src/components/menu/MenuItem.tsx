import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import RadarAnimation from '../radar';

export interface MenuItemProps {
    /** 'aria-checked' - ARIA attribute for checkbox elements */
    'aria-checked'?: boolean;
    /** 'aria-disabled' - ARIA attribute describing whether the menu item is disabled */
    'aria-disabled'?: boolean | 'true' | 'false';
    /** children - menu item content */
    children?: React.ReactNode;
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

class MenuItem extends React.Component<MenuItemProps> {
    onClickHandler = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const { isDisabled, onClick } = this.props;

        // If aria-disabled is passed as a prop, we should ignore clicks on this menu item
        if (isDisabled) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        if (onClick) {
            onClick(event);
        }
    };

    render() {
        const { children, className, isDisabled, isSelectItem, isSelected, showRadar, ...rest } = this.props;
        const menuItemProps: MenuItemProps = omit(rest, ['role', 'tabIndex', 'onClick']);

        menuItemProps.className = classNames('menu-item', className, {
            'is-select-item': isSelectItem,
            'is-selected': isSelected,
        });
        menuItemProps.role = isSelectItem ? 'menuitemradio' : 'menuitem';
        menuItemProps.tabIndex = -1;
        menuItemProps.onClick = this.onClickHandler;

        if (isSelectItem) {
            menuItemProps['aria-checked'] = isSelected;
        }

        if (isDisabled) {
            menuItemProps['aria-disabled'] = 'true';
        }

        let menuItem = <li {...menuItemProps}>{children}</li>;
        if (showRadar) {
            menuItem = <RadarAnimation>{menuItem}</RadarAnimation>;
        }

        return menuItem;
    }
}

export default MenuItem;
