// @flow
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import SidebarToggleButton from './SidebarToggleButton';
import notes from './SidebarToggleButton.stories.md';

export const open = () => (
    <IntlProvider locale="en" textComponent={React.Fragment}>
        <SidebarToggleButton isOpen />
    </IntlProvider>
);

export const closed = () => (
    <IntlProvider locale="en" textComponent={React.Fragment}>
        <SidebarToggleButton isOpen={false} />
    </IntlProvider>
);

export const leftFacing = () => (
    <IntlProvider locale="en" textComponent={React.Fragment}>
        <SidebarToggleButton direction="left" isOpen />
    </IntlProvider>
);

export default {
    title: 'Components|SidebarToggleButton',
    component: SidebarToggleButton,
    parameters: {
        notes,
    },
};
