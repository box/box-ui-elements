module.exports = {
    extends: ['stylelint-config-standard-scss'],
    plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
    rules: {
        'no-descending-specificity': null, // fixme
        'declaration-no-important': null, // fixme
        'property-no-vendor-prefix': null, // fixme
        'no-duplicate-selectors': null, // fixme
        'selector-no-vendor-prefix': null, // fixme
        'property-no-unknown': null, // fixme
        'at-rule-no-vendor-prefix': null, // fixme
        'selector-class-pattern': '[A-Za-z]+([-_]{1,2}[A-Za-z]+)*(_[A-Za-z]+)*$',
        // rules from @box/frontend
        'at-rule-no-unknown': null,
        'media-feature-name-no-vendor-prefix': true,
        'value-no-vendor-prefix': true,
        'font-weight-notation': 'named-where-possible',
        'order/order': [
            'dollar-variables',
            'custom-properties',
            'declarations',
            'rules',
            // ignore at-rules (@supports, @include, @media)
            // so that devs can decide where to put them
        ],
        'order/properties-order': [],
        'plugin/rational-order': [
            true,
            {
                'border-in-box-model': false,
                'empty-line-between-groups': false,
            },
        ],
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
