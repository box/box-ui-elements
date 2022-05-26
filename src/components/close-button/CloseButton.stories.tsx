import * as React from 'react';

import CloseButton from './CloseButton';
import notes from './CloseButton.stories.md';

export const regular = () => <CloseButton />;

export default {
    title: 'Components|Buttons/CloseButton',
    component: CloseButton,
    parameters: {
        notes,
    },
};
