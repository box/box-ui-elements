const eslintrc = require.resolve('@box/frontend/eslint/eslintrc.js');

module.exports = {
    extends: [eslintrc],
    rules: {
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'import/no-extraneous-dependencies': 'off', // fixme
        'react/default-props-match-prop-types': 'off', // fixme
        'react/destructuring-assignment': 'off', // fixme
        'react/forbid-prop-types': 'off', // fixme
        'react/jsx-sort-props': 'off', // fixme
        'react/jsx-no-bind': 'off', // fixme
        'react/sort-comp': 'off', // fixme
        'react/no-unused-prop-types': 'off', // fixme
        'react/no-access-state-in-setstate': 'off', // fixme
        'react/no-array-index-key': 'off', // fixme
        'react/no-this-in-sfc': 'off',
        'import/no-unresolved': 'off', // fixme
    },
    overrides: [
        {
            files: ['*.test.js', '*.test.tsx'],
            globals: {
                blurInput: true,
                clearInput: true,
                shallow: true,
                mount: true,
                takeModalScreenshot: true,
                takeScreenshot: true,
                takeScreenshotAfterInput: true,
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off', // fixme
            }
        }
    ]
};
