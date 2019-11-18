const eslintrc = require.resolve('@box/frontend/eslint/eslintrc.js');

module.exports = {
    extends: [eslintrc],
    rules: {
        camelcase: 'off',
        'class-methods-use-this': 'off',
        'formatjs/enforce-description': 'error', // fixme
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
        '@typescript-eslint/explicit-function-return-type': 'off', // fixme
    },
    plugins: ['formatjs'],
    overrides: [
        {
            files: ['*.test.js', '*.test.tsx'],
            globals: {
                shallow: true,
                mount: true,
                takeScreenshot: true,
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off', // fixme
            },
            parser: "@typescript-eslint/parser",
            extends: [
                eslintrc,
                "plugin:@typescript-eslint/recommended",
                "prettier/@typescript-eslint",
            ],
            "settings": {
                "import/resolver": {
                "typescript": {
                    "directory": "."
                }
                }
            },
            overrides: [
                {
                    files: ['*.stories.tsx', '*.test.tsx'],
                    rules: {
                        'import/no-extraneous-dependencies': 'off'
                    },
                }
            ]
        }
    ]
};
