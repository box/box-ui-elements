import * as React from 'react';

import Logo from './Logo';
import notes from './Logo.stories.md';

export const regular = () => <Logo title="Box" />;

export default {
    title: 'Components|Logo',
    component: Logo,
    parameters: {
        notes,
    },
};
