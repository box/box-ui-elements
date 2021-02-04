import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import Ghost from './Ghost';
import notes from './Ghost.stories.md';

export const regular = () => <Ghost isAnimated={boolean('isAnimated', true)} />;

export const withoutAnimation = () => <Ghost isAnimated={false} />;

export default {
    title: 'Components|Ghost',
    component: Ghost,
    parameters: {
        notes,
    },
};
