import * as React from 'react';

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
        <SelectMenuLinkItem isSelected>
            <Link href="https://opensource.box.com/box-ui-elements/">View Profile</Link>
        </SelectMenuLinkItem>
        <SelectMenuLinkItem>
            <Link href="https://opensource.box.com/box-ui-elements/">Awesome Link</Link>
        </SelectMenuLinkItem>
    </Menu>
);

export const withChildOnResize = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLargeMenu, setIsLargeMenu] = React.useState(true);
    const setVisibility = () => {
        if (window.innerWidth < 700 && !isLargeMenu) {
            setIsLargeMenu(true);
        }
    };

    window.addEventListener('resize', setVisibility);

    return (
        <Menu>
            <MenuItem>View Profile</MenuItem>
            <MenuItem>Help</MenuItem>
            {isLargeMenu && <MenuItem>Visible on Resize</MenuItem>}
            <MenuItem>Last Item</MenuItem>
        </Menu>
    );
};

export default {
    title: 'Components/Menu',
    component: Menu,
    parameters: {
        notes,
    },
};
