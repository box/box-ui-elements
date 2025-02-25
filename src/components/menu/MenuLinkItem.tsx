import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { MenuItemProps } from './MenuItem';

const MenuLinkItem = ({ children, isSelected = false, isSelectItem = false, ...rest }: MenuItemProps) => {
    const linkEl = React.Children.only(children) as React.ReactElement;

    const listItemProps: MenuItemProps = omit(rest, ['role', 'tabIndex']);
    listItemProps.role = 'none';

    const linkProps: MenuItemProps = {
        className: classNames('menu-item', linkEl ? (linkEl.props as { className?: string }).className : '', {
            'is-select-item': isSelectItem,
            'is-selected': isSelected,
        }),
        role: isSelectItem ? 'menuitemradio' : 'menuitem',
        tabIndex: -1,
    };

    if (isSelectItem) {
        linkProps['aria-checked'] = isSelected;
    }

    return <li {...listItemProps}>{React.cloneElement(linkEl, linkProps)}</li>;
};

export default MenuLinkItem;
