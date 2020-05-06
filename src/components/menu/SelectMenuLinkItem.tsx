import * as React from 'react';

import MenuLinkItem from './MenuLinkItem';
import { MenuItemProps } from './MenuItem';

const SelectMenuLinkItem = (props: MenuItemProps) => <MenuLinkItem isSelectItem {...props} />;

export default SelectMenuLinkItem;
