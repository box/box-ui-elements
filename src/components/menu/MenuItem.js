// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import RadarAnimation from '../radar';

type Props = {
    children: React.Node,
    className?: string,
    isDisabled?: boolean,
    isSelectItem?: boolean,
    isSelected?: boolean,
    onClick?: Function,
    showRadar?: boolean,
};

class MenuItem extends React.Component<Props> {
    onClickHandler = (event: SyntheticEvent<HTMLLIElement>) => {
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
        const menuItemProps = omit(rest, ['role', 'tabIndex', 'onClick']);

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
