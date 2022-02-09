// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import Avatar from '../avatar/Avatar';
import Link from '../link/Link';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import MenuLinkItem from '../menu/MenuLinkItem';
import MenuSeparator from '../menu/MenuSeparator';
import MenuToggle from './MenuToggle';
import PlainButton from '../plain-button/PlainButton';
import SubmenuItem from '../menu/SubmenuItem';
import { ResponsiveDropdownMenu } from './DropdownMenu';
import notes from './ResponsiveDropdownMenu.stories.md';

function generateClickHandler(message) {
    return event => {
        event.preventDefault();
        /* eslint-disable-next-line no-console */
        console.log(`${message} menu option selected`);
    };
}

export const basic = () => (
    <ResponsiveDropdownMenu responsiveMenuProps={{ title: 'Title', subtitle: 'Subtitle' }}>
        <PlainButton className="dropdown-menu-example-button" type="button">
            <MenuToggle>
                <Avatar id="123" name="Jay Tee" />
            </MenuToggle>
        </PlainButton>
        <Menu>
            <MenuItem onClick={generateClickHandler('View Profile')}>View Profile</MenuItem>
            <MenuItem onClick={generateClickHandler('Help')}>Help</MenuItem>
            <MenuItem
                onClick={generateClickHandler('Should Not Fire This Handler')}
                isDisabled={boolean('isDisabled', true)}
            >
                Disabled Option
            </MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
            <MenuSeparator />
            <MenuLinkItem>
                <Link href="/logout-example-link" onClick={generateClickHandler('Log Out')}>
                    Log Out
                </Link>
            </MenuLinkItem>
        </Menu>
    </ResponsiveDropdownMenu>
);

export const withButton = () => (
    <ResponsiveDropdownMenu
        responsiveMenuProps={{
            title: 'Title',
            subtitle: 'Subtitle',
            buttonText: 'Action',
            onButtonClick: generateClickHandler('Clicked on Action'),
        }}
    >
        <PlainButton className="dropdown-menu-example-button" type="button">
            <MenuToggle>
                <Avatar id="123" name="Jay Tee" />
            </MenuToggle>
        </PlainButton>
        <Menu>
            <MenuItem onClick={generateClickHandler('View Profile')}>View Profile</MenuItem>
            <MenuItem onClick={generateClickHandler('Help')}>Help</MenuItem>
            <MenuItem
                onClick={generateClickHandler('Should Not Fire This Handler')}
                isDisabled={boolean('isDisabled', true)}
            >
                Disabled Option
            </MenuItem>
            <SubmenuItem>
                Submenu
                <Menu>
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>Help</MenuItem>
                </Menu>
            </SubmenuItem>
            <MenuSeparator />
            <MenuLinkItem>
                <Link href="/logout-example-link" onClick={generateClickHandler('Log Out')}>
                    Log Out
                </Link>
            </MenuLinkItem>
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
