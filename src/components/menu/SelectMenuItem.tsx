import * as React from 'react';

import MenuItem, { MenuItemProps } from './MenuItem';

const SelectMenuItem = (props: MenuItemProps) => <MenuItem isSelectItem {...props} />;

export default SelectMenuItem;
