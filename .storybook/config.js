import { configure, addParameters, addDecorator } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import enUS from '../i18n/en-US';
import deDE from '../i18n/de-DE';
import jaJP from '../i18n/ja-JP';

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

// Enable translations in stories
const messages = {
    'en': { ...enUS },
    'de': { ...deDE },
    'jp': { ...jaJP },
};

const getMessages = (locale) => messages[locale];

setIntlConfig({
    locales: ['en', 'de', 'jp'],
    defaultLocale: 'en',
    getMessages,
});

addDecorator(withIntl);

configure([require.context('../src', true, /\.stories\.(js|tsx)$/)], module);
