import * as React from 'react';

import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';

import ContextMenu from './ContextMenu';
import notes from './ContextMenu.stories.md';

import ContextMenuWithSubmenuExample from './ContextMenuWithSubmenuExample';

import './ContextMenuExample.scss';

export const basic = () => (
    <ContextMenu>
        <div className="context-menu-example-target">Target Component - right click me</div>
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Help</MenuItem>
        </Menu>
    </ContextMenu>
);

export const withSubmenu = () => <ContextMenuWithSubmenuExample />;

export default {
    title: 'Components/ContextMenu',
    component: ContextMenu,
    parameters: {
        notes,
    },
};
