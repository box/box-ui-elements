/**
 * @flow
 * @file Menu Link Item component
 * @author Box
 */

import React, { cloneElement, Children } from 'react';
import omit from 'lodash.omit';

type Props = {
    children: any
};

const MenuLinkItem = ({ children, ...rest }: Props) => {
    const linkEl = Children.only(children);

    const listItemProps = omit(rest, ['role', 'tabIndex']);
    listItemProps.role = 'none';

    const linkProps = {
        role: 'menuitem',
        tabIndex: -1
    };

    return (
        <li {...listItemProps}>
            {cloneElement(linkEl, linkProps)}
        </li>
    );
};

export default MenuLinkItem;
