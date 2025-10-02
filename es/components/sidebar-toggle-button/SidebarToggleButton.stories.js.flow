// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import SidebarToggleButton from './SidebarToggleButton';
import notes from './SidebarToggleButton.stories.md';

export const open = () => (
    <IntlProvider locale="en">
        <SidebarToggleButton isOpen />
    </IntlProvider>
);

export const closed = () => (
    <IntlProvider locale="en">
        <SidebarToggleButton isOpen={false} />
    </IntlProvider>
);

export const leftFacing = () => (
    <IntlProvider locale="en">
        <SidebarToggleButton direction="left" isOpen />
    </IntlProvider>
);

export default {
    title: 'Components/SidebarToggleButton',
    component: SidebarToggleButton,
    parameters: {
        notes,
    },
};
