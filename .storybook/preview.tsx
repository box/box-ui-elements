import { IntlProvider } from 'react-intl';

import features from '../examples/src/features';

import '../src/styles/variables';
import '../src/styles/base.scss';
import { reactIntl } from "./reactIntl";
import { ProjectAnnotations, Renderer } from "@storybook/types";

// Constants
global.FEATURE_FLAGS = global.FEATURE_FLAGS || features;
global.FILE_ID = global.FILE_ID || '415542803939';
global.FOLDER_ID = global.FOLDER_ID || '0';
// NOTE: The token used is a readonly token accessing public data in a demo enterprise. DO NOT PUT A WRITE TOKEN
global.TOKEN = global.TOKEN || 'y9TFkbZ1n29KEpR3Fl6Aqlc24tV5JAMh';

const preview: ProjectAnnotations<Renderer> = {
    globals: {
        locale: reactIntl.defaultLocale,
        locales: {
            en: 'English',
            de: 'Deutsche',
        },
    },
    decorators:[
        (Story) =>
            (
                <IntlProvider locale='en'>
                    <Story />
                </IntlProvider>
            ),
    ],
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
        reactIntl,
    },
};

export default preview;
