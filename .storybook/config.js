import { addParameters, configure } from '@storybook/react';
import customTheme from './customTheme';
import '../src/styles/variables';
import '../src/styles/base.scss';

addParameters({
    options: {
        theme: customTheme,
    },
});

configure([require.context('../src', true, /\.stories\.js$/)], module);
