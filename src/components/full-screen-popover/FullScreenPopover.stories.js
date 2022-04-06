// @flow
import * as React from 'react';

import { Tab, TabView } from '../tab-view';
import Menu from '../menu/Menu';
import PrimaryButton from '../primary-button';
import MenuItem from '../menu/MenuItem';
import MenuSeparator from '../menu/MenuSeparator';
import FullScreenPopover from './FullScreenPopover';
import notes from './FullScreenPopover.stories.md';

export const basic = () => (
    <FullScreenPopover>
        <PrimaryButton>Click (basic)</PrimaryButton>
        <h1>Content</h1>
    </FullScreenPopover>
);

export const withCustomHeader = () => {
    const header = (
        <div>
            <div style={{ color: '#222', fontWeight: 'bold', fontSize: '16px' }}>Primary title</div>
            <div style={{ color: '#767676', fontSize: '12px' }}>Secondary title</div>
        </div>
    );

    return (
        <FullScreenPopover header={header}>
            <PrimaryButton>Click (with header)</PrimaryButton>
            <h1>Content</h1>
        </FullScreenPopover>
    );
};

export const withCustomCloseOnClickElements = () => {
    const selector = '.menu-item, #close';

    return (
        <FullScreenPopover onCloseClassSelector={selector}>
            <PrimaryButton>Click (custom close on click elements)</PrimaryButton>
            <TabView>
                <Tab key="menu-tab" title="Menu">
                    <Menu>
                        <MenuItem>Menu Item 1</MenuItem>
                        <MenuItem>Menu Item 2</MenuItem>
                        <MenuSeparator />
                        <MenuItem>Menu Item 3</MenuItem>
                    </Menu>
                </Tab>
                <Tab key="details-tab" title="Details">
                    <h1>Details</h1>
                    <div>
                        <PrimaryButton id="close">This triggers close</PrimaryButton>
                        <PrimaryButton id="no-close">This does not trigger close</PrimaryButton>
                    </div>
                </Tab>
            </TabView>
        </FullScreenPopover>
    );
};

export default {
    title: 'Components|FullScreenPopover',
    component: FullScreenPopover,
    parameters: {
        notes,
    },
};
