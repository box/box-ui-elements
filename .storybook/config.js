import { addParameters, configure } from '@storybook/react';
import customTheme from './customTheme';
import '../src/styles/variables';
import '../src/styles/base.scss';

// Automatically import all files ending in *.stories.js
const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
    req.keys().forEach(filename => req(filename));
}

addParameters({
    options: {
        theme: customTheme,
    },
});

configure(loadStories, module);
