import enUS from '../i18n/en-US';
import deDE from '../i18n/de-DE';
import frFR from '../i18n/fr-FR';
import jaJP from '../i18n/ja-JP';
import zhCN from '../i18n/zh-CN';

const locales = ['en', 'de', 'fr', 'jp', 'zh'];

const messages = {
    'en': { ...enUS },
    'de': { ...deDE },
    'fr': { ...frFR },
    'jp': { ...jaJP },
    'zh': { ...zhCN },
};

export const reactIntl = {
    defaultLocale: 'en',
    locales,
    messages,
};
