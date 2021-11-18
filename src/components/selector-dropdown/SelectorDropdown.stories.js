// @flow
import * as React from 'react';

import SelectorDropdownExamples from '../../../examples/src/SelectorDropdownExamples';
import SelectorDropdown from './SelectorDropdown';
import notes from './SelectorDropdown.stories.md';

export const basic = () => <SelectorDropdownExamples />;

export default {
    title: 'Components|SelectorDropdown',
    component: SelectorDropdown,
    parameters: {
        notes,
    },
};
