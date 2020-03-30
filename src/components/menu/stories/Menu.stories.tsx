import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { State, Store } from '@sambego/storybook-state';

import Link from '../../link/Link';
import MenuItem from '../MenuItem';
import MenuLinkItem from '../MenuLinkItem';
import MenuSectionHeader from '../MenuSectionHeader';
import MenuSeparator from '../MenuSeparator';
import SelectMenuLinkItem from '../SelectMenuLinkItem';
import SubmenuItem from '../SubmenuItem';

import Menu from '../Menu';
import notes from './Menu.stories.md';

export const basic = () => (
    <Menu>
        <MenuItem>View Profile</MenuItem>
        <MenuItem showRadar>Help</MenuItem>
        <MenuSeparator />
        <MenuSectionHeader>Menu Section</MenuSectionHeader>
        <MenuLinkItem>
            <Link href="/#">Awesome Link</Link>
        </MenuLinkItem>
    </Menu>
);

export const withSubmenu = () => (
    <div style={{ maxWidth: '220px' }}>
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
            <MenuItem>Help</MenuItem>
        </Menu>
    </div>
);

export const withSubmenuFlip = () => (
    <div style={{ maxWidth: '220px' }}>
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
            <MenuItem>Help</MenuItem>
        </Menu>
    </div>
);

export const withSelectMenu = () => (
    <Menu>
        <SelectMenuLinkItem isSelected={boolean('isSelected', true)}>
            <Link href="http://opensource.box.com/box-ui-elements/storybook">View Profile</Link>
        </SelectMenuLinkItem>
        <SelectMenuLinkItem>
            <Link href="http://opensource.box.com/box-ui-elements/storybook">Awesome Link</Link>
        </SelectMenuLinkItem>
    </Menu>
);

export const withChildOnResize = () => {
    const componentStore = new Store({ isLargeMenu: false });

    const setVisibility = () => {
        if (window.innerWidth < 700 && !componentStore.get('isLargeMenu')) {
            componentStore.set({ isLargeMenu: true });
        }
    };

    window.addEventListener('resize', setVisibility);

    return (
        <State store={componentStore}>
            {state => (
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                    {state.isLargeMenu && <MenuItem>Visible on Resize</MenuItem>}
                    <MenuItem>Last Item</MenuItem>
                </Menu>
            )}
        </State>
    );
};

export default {
    title: 'Components|Menu',
    component: Menu,
    parameters: {
        notes,
    },
};
