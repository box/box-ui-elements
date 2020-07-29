import * as React from 'react';

import Indicator from './Indicator';

import notes from './Indicator.stories.md';

export const basic = () => (
    <Indicator>
        <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
        </span>
    </Indicator>
);

export default {
    title: 'Components|Indicator',
    component: Indicator,
    parameters: {
        notes,
    },
};
