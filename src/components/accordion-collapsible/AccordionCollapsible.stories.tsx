import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import notes from './AccordionCollapsible.stories.md';

import AccordionCollapsible from './AccordionCollapsible';

export default {
    title: 'Components|AccordionCollapsible',
    component: AccordionCollapsible,
    parameters: {
        notes,
    },
};
