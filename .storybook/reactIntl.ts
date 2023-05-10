const locales = ['en-US', 'de-DE'];

const messages = locales.reduce(
    (acc, lang) => ({
        ...acc,
        [lang]: require(`../i18n/json/src/${lang}.properties`), // whatever the relative path to your messages json is
    }),
    {},
);

const formats = {}; // optional, if you have any formats

export const reactIntl = {
    defaultLocale: 'en',
    locales,
    messages,
    formats,
};
