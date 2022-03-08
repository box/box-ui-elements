// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import Avatar from '../avatar/Avatar';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import MenuToggle from '../dropdown-menu/MenuToggle';
import PlainButton from '../plain-button/PlainButton';
import SubmenuItem from '../menu/SubmenuItem';
import ResponsiveDropdownMenu from './ResponsiveDropdownMenu';
import notes from './ResponsiveDropdownMenu.stories.md';

export const basic = () => (
    <ResponsiveDropdownMenu responsiveMenuProps={{ title: 'Title', subtitle: 'Subtitle' }}>
        <PlainButton className="dropdown-menu-example-button" type="button">
            <MenuToggle>
                <Avatar id="123" name="Jay Tee" />
            </MenuToggle>
        </PlainButton>
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Help</MenuItem>
            <MenuItem isDisabled={boolean('isDisabled', true)}>Disabled Option</MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
        </Menu>
    </ResponsiveDropdownMenu>
);

export const withButton = () => (
    <ResponsiveDropdownMenu
        responsiveMenuProps={{
            title: 'Title',
            subtitle: 'Subtitle',
            buttonText: 'Action',
        }}
    >
        <PlainButton className="dropdown-menu-example-button" type="button">
            <MenuToggle>
                <Avatar id="123" name="Jay Tee" />
            </MenuToggle>
        </PlainButton>
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Help</MenuItem>
            <MenuItem isDisabled={boolean('isDisabled', true)}>Disabled Option</MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
        </Menu>
    </ResponsiveDropdownMenu>
);

export default {
    title: 'Components|DropdownMenu/Responsive',
    component: ResponsiveDropdownMenu,
    parameters: {
        notes,
        viewport: {
            viewports: INITIAL_VIEWPORTS,
            defaultViewport: 'iphonex',
        },
    },
};
