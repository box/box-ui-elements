const stylelintrc = require.resolve('@box/frontend/stylelint/stylelint.config.js');

const customSuitSelector = component => {
    const namespace = 'bdl';
    const block = component;
    const camelCase = '[a-z][a-zA-Z0-9]*';
    const state = `(?:.${namespace}-(is|has)-${camelCase})?`;
    const element = `(?:-${camelCase})?`;
    const modifier = `(?:--${camelCase})?`;
    const attribute = '(?:\\[.+\\])?';
    return new RegExp(`^\\.${namespace}-${block}${element}${modifier}${attribute}${state}$`);
};

module.exports = {
    extends: [stylelintrc],
    plugins: ['stylelint-selector-bem-pattern'],
    rules: {
        'no-descending-specificity': null, // fixme
        'declaration-no-important': null, // fixme
        'property-no-vendor-prefix': null, // fixme
        'no-duplicate-selectors': null, // fixme
        'max-empty-lines': null, // fixme
        'selector-no-vendor-prefix': null, // fixme
        'property-no-unknown': null, // fixme
        'at-rule-no-vendor-prefix': null, // fixme

        'plugin/selector-bem-pattern': {
            preset: 'suit',
            componentName: '[A-Z]+',
            componentSelectors: {
                initial: customSuitSelector,
            },
        },
    },
};
