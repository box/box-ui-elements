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
                BoxVisualTestUtils: true,
                shallow: true,
                mount: true,
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'flowtype/no-types-missing-file-annotation': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off', // fixme
                '@typescript-eslint/explicit-function-return-type': 'off', // fixme
                '@typescript-eslint/ban-types': [
                    'error',
                    {
                        'types': {
                            'Function': false, // fixme
                            'Object': false, // fixme
                            'object': false, // fixme
                            '{}': false, // fixme
                        }
                    }
                ],
                // note you must disable the base rule as it can report incorrect errors:
                'no-use-before-define': 'off',
                '@typescript-eslint/ban-ts-ignore': 'off', // deprecated
                '@typescript-eslint/no-use-before-define': ['error'],
                '@typescript-eslint/ban-ts-comment': [
                    'error',
                    {
                        'ts-expect-error': 'allow-with-description',
                        'ts-ignore': 'allow-with-description',
                        'ts-nocheck': 'allow-with-description',
                        'ts-check': 'allow-with-description',
                        minimumDescriptionLength: 1,
                    },
                ],
                'camelcase': 'error',
                'no-shadow': 'off',
                '@typescript-eslint/no-shadow': ['error'],
            },
        },
    ],
};
