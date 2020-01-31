import { configure, addParameters, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';

import '../scripts/styleguide.setup.js';
import customTheme from './customTheme';
import '../src/styles/variables';
import '../src/styles/base.scss';

addDecorator(withKnobs);

addParameters({
    options: {
        theme: customTheme,
    },
});

configure([require.context('../src', true, /\.stories\.(js|tsx)$/)], module);
