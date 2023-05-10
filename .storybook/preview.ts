import { Preview } from '@storybook/react';
import { reactIntl } from './reactIntl';

const preview: Preview = {
    globals: {
        locale: reactIntl.defaultLocale,
        locales: {
            en: 'English',
            de: 'Deutsche',
        },
    },
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        reactIntl,
    },
};

export default preview;
