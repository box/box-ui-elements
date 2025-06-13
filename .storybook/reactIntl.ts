import boxLanguages from '@box/languages';

const messages = boxLanguages.reduce(
    (bundles, language) => ({
        ...bundles,
        // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-var-requires
        [language]: require(`../i18n/bundles/${language}`).messages,
    }),
    {},
);

export const reactIntl = {
    defaultLocale: 'en-US',
    messages,
};
