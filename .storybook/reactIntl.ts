// eslint-disable-next-line @typescript-eslint/no-var-requires
const boxLanguages = require('@box/languages');

const messages = boxLanguages.reduce(
    (acc, lang) => ({
        ...acc,
        // eslint-disable-next-line global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires
        [lang]: require(`../i18n/bundles/${lang}`).messages, // whatever the relative path to your messages json is
    }),
    {},
);

export const reactIntl = {
    defaultLocale: 'en-US',
    messages,
};
