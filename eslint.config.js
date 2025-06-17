// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

// Plugins
const cypress = require('eslint-plugin-cypress/flat');

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended });

module.exports = [
    {
        ignores: [
            'build/',
            'dist/',
            'es/',
            'flow/',
            'flow-typed/npm/',
            'i18n/',
            'node_modules/',
            'reports/',
            '**/__snapshots__/',
            '**/*.json',
            '**/*.png',
        ],
    },
    ...compat.extends(
        require.resolve('@box/frontend/eslint/base'),
        require.resolve('@box/frontend/eslint/react'),
        require.resolve('@box/frontend/eslint/typescript'),
        require.resolve('@box/frontend/eslint/flow'),
    ),
    cypress.configs.recommended,
    {
        rules: {
            camelcase: 'off',
            'class-methods-use-this': 'off',
            'import/export': 'off', // fixme
            'import/no-extraneous-dependencies': 'off', // fixme
            'import/no-named-as-default': 'off', // fixme
            'import/no-named-as-default-member': 'off', // fixme
            'import/no-unresolved': 'off', // fixme
            'jsx-a11y/label-has-associated-control': 'off',
            'react/default-props-match-prop-types': 'off', // fixme
            'react/destructuring-assignment': 'off', // fixme
            'react/forbid-prop-types': 'off', // fixme
            'react/jsx-no-bind': 'off', // fixme
            'react/jsx-sort-props': 'off', // fixme
            'react/no-access-state-in-setstate': 'off', // fixme
            'react/no-array-index-key': 'off', // fixme
            'react/no-this-in-sfc': 'off',
            'react/no-unknown-property': 'off', // fixme
            'react/no-unused-prop-types': 'off', // fixme
            'react/prop-types': 'off', // fixme
            'react/sort-comp': 'off', // fixme
            'no-promise-executor-return': 'off', // fixme
            'no-undef': 'off', // fixme
            'no-unused-expressions': 'off', // fixme
        },
    },
    {
        files: ['**/*.test.js', '**/*.test.tsx'],
        languageOptions: {
            globals: {
                BoxVisualTestUtils: true,
                shallow: true,
                mount: true,
            },
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/ban-ts-comment': [
                'error',
                {
                    'ts-check': 'allow-with-description',
                    'ts-expect-error': 'allow-with-description',
                    'ts-ignore': 'allow-with-description',
                    'ts-nocheck': 'allow-with-description',
                    minimumDescriptionLength: 1,
                },
            ],
            '@typescript-eslint/ban-ts-ignore': 'off',
            '@typescript-eslint/ban-types': [
                'error',
                {
                    types: {
                        Function: false, // fixme
                        Object: false, // fixme
                        object: false, // fixme
                        '{}': false, // fixme
                    },
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off', // fixme
            '@typescript-eslint/explicit-module-boundary-types': 'off', // fixme
            '@typescript-eslint/no-non-null-assertion': 'off', // fixme
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-use-before-define': ['error'],
        },
    },
];
