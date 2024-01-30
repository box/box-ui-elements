import { IntlProvider } from 'react-intl';

import features from '../examples/src/features';

import '../src/styles/variables';
import '../src/styles/base.scss';
import { reactIntl } from "./reactIntl";

import {initialize, mswDecorator} from 'msw-storybook-addon';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize();


// Constants
global.FEATURE_FLAGS = global.FEATURE_FLAGS || features;
global.FILE_ID = global.FILE_ID || '415542803939';
global.FOLDER_ID = global.FOLDER_ID || '69083462919';
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || 'P1n3ID8nYMxHRWvenDatQ9k6JKzWzYrz';

const preview: any = {
    globals: {
        locale: reactIntl.defaultLocale,
        locales: {
            en: 'English',
            de: 'Deutsche',
        },
    },
    decorators:[
        mswDecorator,
        (Story) =>
            (
                <IntlProvider locale='en'>
                    <Story />
                </IntlProvider>
            ),
    ],
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        chromatic: { disableSnapshot: true },
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
        reactIntl,
    },
};

export default preview;
