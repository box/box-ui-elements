const eslintrc = require.resolve('@box/frontend/eslint/eslintrc.js');

module.exports = {
    extends: [eslintrc],
    rules: {
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'consistent-return': 'off', // fixme
        'flowtype/sort-keys': 'off', // fixme
        'jsx-a11y/anchor-is-valid': 'off', // fixme
        'jsx-a11y/click-events-have-key-events': 'off', // fixme
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/label-has-for': 'off', // fixme
        'jsx-a11y/no-noninteractive-tabindex': 'off', // fixme
        'jsx-a11y/no-static-element-interactions': 'off', // fixme
        'jsx-a11y/no-onchange': 'off', // fixme
        'import/no-extraneous-dependencies': 'off', // fixme
        'import/prefer-default-export': 'off', // fixme
        'no-plusplus': 'off',
        'no-restricted-globals': 'off', // fixme
        'no-shadow': 'off', // fixme
        'no-underscore-dangle': 'off', // fixme
        'no-unused-vars': 'off', // fixme
        'one-var': 'off', // fixme
        'prefer-destructuring': 'off', // fixme
        'prefer-promise-reject-errors': 'off', // fixme
        'react/button-has-type': 'off', // fixme
        'react/default-props-match-prop-types': 'off', // fixme
        'react/destructuring-assignment': 'off', // fixme
        'react/display-name': 'off',
        'react/forbid-prop-types': 'off', // fixme
        'react/jsx-sort-props': 'off', // fixme
        'react/jsx-no-bind': 'off', // fixme
        'react/sort-comp': 'off', // fixme
        'react/no-unused-prop-types': 'off', // fixme
        'react/no-access-state-in-setstate': 'off', // fixme
        'react/no-array-index-key': 'off', // fixme
        'react/no-this-in-sfc': 'off',
        'react/no-unused-state': 'off', // fixme
        'react/prefer-stateless-function': 'off', // fixme
    },
    settings: {
        'import/resolver': {
            'babel-module': {},
        },
    },
    globals: {
        shallow: true,
        mount: true,
    },
};
