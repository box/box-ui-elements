const stylelintrc = require.resolve('@box/frontend/stylelint/stylelint.config.js');

module.exports = {
    extends: [stylelintrc],
    rules: {
        'no-descending-specificity': null, // fixme
        'declaration-no-important': null, // fixme
        'property-no-vendor-prefix': null, // fixme
        'no-duplicate-selectors': null, // fixme
        'max-empty-lines': null, // fixme
        'selector-no-vendor-prefix': null, // fixme
        'property-no-unknown': null, // fixme
        'at-rule-no-vendor-prefix': null, // fixme
    },
};
