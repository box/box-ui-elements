import { Preview } from '@storybook/react';
import { IntlProvider } from 'react-intl';

import features from '../examples/src/features';

import '../src/styles/variables';
import '../src/styles/base.scss';

// Constants
global.FEATUREFLIPS = global.FEATUREFLIPS || features; // cannot use the word FEATURES, storybook uses it
global.FILE_ID = global.FILE_ID || '415542803939'; // eslint-disable-line
global.FOLDER_ID = global.FOLDER_ID || '69083462919'; // eslint-disable-line
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || 'P1n3ID8nYMxHRWvenDatQ9k6JKzWzYrz'; // eslint-disable-line
global.PROPS = global.PROPS || {}; // eslint-disable-line

// Components
global.IntlProvider = IntlProvider;

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        options: {
            storySort: {
                order: ['Elements'],
            },
        },
    },
};

export default preview;
