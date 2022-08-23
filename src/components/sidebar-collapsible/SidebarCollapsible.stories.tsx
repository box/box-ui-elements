import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import notes from './SidebarCollapsible.stories.md';

import SidebarCollapsible from './SidebarCollapsible';

export default {
    title: 'Components|SidebarCollapsible',
    component: SidebarCollapsible,
    parameters: {
        notes,
    },
};
