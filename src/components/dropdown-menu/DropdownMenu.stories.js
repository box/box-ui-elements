// @flow
import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Avatar from '../avatar/Avatar';
import Link from '../link/Link';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import MenuLinkItem from '../menu/MenuLinkItem';
import MenuSeparator from '../menu/MenuSeparator';
import MenuToggle from './MenuToggle';
import PlainButton from '../plain-button/PlainButton';

import DropdownMenu from './DropdownMenu';
import notes from './DropdownMenu.stories.md';

function generateClickHandler(message) {
    return event => {
        event.preventDefault();
        /* eslint-disable-next-line no-console */
        console.log(`${message} menu option selected`);
    };
}

export const basic = () => (
    <DropdownMenu
        onMenuOpen={() => {
            /* eslint-disable-next-line no-console */
            console.log('menu opened');
        }}
        onMenuClose={() => {
            /* eslint-disable-next-line no-console */
            console.log('menu closed');
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
            <MenuSeparator />
            <MenuLinkItem>
                <Link href="/logout-example-link" onClick={generateClickHandler('Log Out')}>
                    Log Out
                </Link>
            </MenuLinkItem>
        </Menu>
    </DropdownMenu>
);

export const withLinkMenu = () => (
    // When using `MenuToggle` in an element with the `lnk` class, the caret icon is automatically colored blue.
    <DropdownMenu>
        <PlainButton className="lnk">
            <MenuToggle>Hello</MenuToggle>
        </PlainButton>
        <Menu>
            <MenuItem
                /* eslint-disable-next-line no-console */
                onClick={() => console.log('hey')}
            >
                Menu Item
            </MenuItem>
        </Menu>
    </DropdownMenu>
);

export default {
    title: 'Components|DropdownMenu',
    component: DropdownMenu,
    parameters: {
        notes,
    },
};
