// @flow
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

type Props = {
    children: React.Node,
    isSelectItem?: boolean,
    isSelected?: boolean,
};

const MenuLinkItem = ({ children, isSelected = false, isSelectItem = false, ...rest }: Props) => {
    const linkEl = React.Children.only(children);

    const listItemProps = omit(rest, ['role', 'tabIndex']);
    listItemProps.role = 'none';

    const linkProps: Object = {
        className: classNames('menu-item', linkEl.props.className, {
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
