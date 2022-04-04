// @flow
import * as React from 'react';

import Menu from '../menu/Menu';
import PrimaryButton from '../primary-button';
import MenuItem from '../menu/MenuItem';
import MenuSeparator from '../menu/MenuSeparator';

import FullscreenFlyout from './FullscreenFlyout';
import OverlayHeader from './OverlayHeader';

export const basic = () => (
    <FullscreenFlyout>
        <PrimaryButton>Click (basic)</PrimaryButton>
        <h1>Content</h1>
    </FullscreenFlyout>
);

export const withHeader = () => (
    <FullscreenFlyout
        header={
            <OverlayHeader
                primaryTitle="Primary Title"
                secondaryTitle="Secondary Title"
                reverseTitle
                actionButton={<PrimaryButton>Action</PrimaryButton>}
            />
        }
    >
        <PrimaryButton>Click (with header)</PrimaryButton>
        <h1>Content</h1>
    </FullscreenFlyout>
);

export const withCustomCloseOnClickElements = () => (
    <FullscreenFlyout
        onCloseClassSelector=".menu-item"
        header={
            <OverlayHeader
                primaryTitle="Primary Title"
                secondaryTitle="Secondary Title"
                actionButton={<PrimaryButton>Action</PrimaryButton>}
            />
        }
    >
        <PrimaryButton>Click (custom close on click elements)</PrimaryButton>
        <Menu>
            <MenuItem>Menu Item 1</MenuItem>
            <MenuItem>Menu Item 2</MenuItem>
            <MenuSeparator />
            <MenuItem>Menu Item 3</MenuItem>
        </Menu>
    </FullscreenFlyout>
);

export default {
    title: 'Components|FullscreenFlyout',
    component: FullscreenFlyout,
};
