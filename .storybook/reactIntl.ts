import boxLanguages from '@box/languages';

// Webpack's require.context includes only bundle files present at compile time.
// Locales without i18n/<locale>.js are skipped by buildLanguageBundles, so Storybook
// can boot from the empty en-US catalog before Moji commits translated files.
const bundleContext = require.context('../i18n/bundles', false, /^\.\/[^/]+\.js$/);
const bundleKeys = new Set(bundleContext.keys());

const messages = boxLanguages.reduce((bundles, language) => {
    const key = `./${language}.js`;
    if (!bundleKeys.has(key)) {
        return bundles;
    }
    return {
        ...bundles,
        [language]: bundleContext(key).messages,
    };
}, {});

export const reactIntl = {
    defaultLocale: 'en-US',
    messages,
};
