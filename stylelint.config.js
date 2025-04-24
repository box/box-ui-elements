const stylelintrc = require.resolve('@box/frontend/stylelint/stylelint.config.js');

module.exports = {
    extends: [stylelintrc],
    rules: {
        'no-descending-specificity': null, // fixme
        'declaration-no-important': null, // fixme
        'property-no-vendor-prefix': null, // fixme
        'no-duplicate-selectors': null, // fixme
        'selector-no-vendor-prefix': null, // fixme
        'property-no-unknown': null, // fixme
        'at-rule-no-vendor-prefix': null, // fixme
        'selector-class-pattern': '[A-Za-z]+([-_]{1,2}[A-Za-z]+)*(_[A-Za-z]+)*$',
        // new rules - TODO reevaluate when components and features have been deprecated
        'scss/dollar-variable-pattern': null,
        'scss/at-mixin-pattern': null,
        'scss/no-global-function-names': null,
        'keyframes-name-pattern': null,
        'scss/at-extend-no-missing-placeholder': null,
        'no-invalid-position-at-import-rule': null,
        'scss/load-no-partial-leading-underscore': null,
    },
};
