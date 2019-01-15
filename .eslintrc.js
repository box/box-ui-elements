const eslintrc = require.resolve('@box/frontend/eslint/eslintrc.js');

module.exports = {
    extends: [eslintrc],
    rules: {
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'flowtype/sort-keys': 'off', //fixme
        'jsx-a11y/label-has-associated-control': 'off',
        'no-shadow': 'off', //fixme
        'react/default-props-match-prop-types': 'off', //fixme
        'react/destructuring-assignment': 'off', //fixme
        'react/display-name': 'off',
        'react/jsx-sort-props': 'off', //fixme
        'react/sort-comp': 'off', //fixme
        'react/no-unused-prop-types': 'off', //fixme
        'react/no-access-state-in-setstate': 'off', //fixme
        'react/no-this-in-sfc': 'off',
        'react/no-unused-state': 'off', //fixme
    },
    settings: {
        'import/resolver': {
            'babel-module': {}
        }
    }
};
