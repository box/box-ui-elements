import { Preview } from '@storybook/react';
// import { reactIntl } from './reactIntl';
import enUS from '../i18n/en-US';
import deDE from '../i18n/de-DE';
import frFR from '../i18n/fr-FR';
import jaJP from '../i18n/ja-JP';
import zhCN from '../i18n/zh-CN';

// Enable translations in stories
const messages = {
    en: { ...enUS },
    de: { ...deDE },
    fr: { ...frFR },
    jp: { ...jaJP },
    zh: { ...zhCN },
};

const getMessages = locale => messages[locale];

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        intl: {
            locales: Object.keys(messages),
            defaultLocale: 'en',
            getMessages,
        },
    },
};

export default preview;
