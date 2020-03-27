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
    docs: {
        extractComponentDescription: (component, { notes }) => {
        if (notes) {
            return typeof notes === 'string' ? notes : notes.markdown || notes.text;
        }
        return null;
        },
  },
});

configure([require.context('../src', true, /\.stories\.(js|tsx)$/)], module);
