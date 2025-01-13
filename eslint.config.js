const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');

// Plugins
const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
    resolvePluginsRelativeTo: __dirname,
    configType: 'flat',
});

module.exports = [
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
        },
    },
    {
        files: ['**/*.js', '**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                sourceType: 'module',
                babelOptions: {
                    presets: ['@babel/preset-react', '@babel/preset-flow', '@babel/preset-typescript'],
                },
            },
            globals: {
                window: true,
                document: true,
            },
        },
    },
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
            'styleguide/',
            '**/__snapshots__/',
            '**/*.json',
            '**/*.png',
        ],
    },
    ...compat.extends(require.resolve('@box/frontend/eslint/base')),
    ...compat.extends(require.resolve('@box/frontend/eslint/react')),
    ...compat.extends(require.resolve('@box/frontend/eslint/typescript')),
    ...compat.extends(require.resolve('@box/frontend/eslint/flow')),
    ...compat.extends('plugin:cypress/recommended'),
    {
        rules: {
            camelcase: 'off',
            'class-methods-use-this': 'off',
            'import/export': 'error',
            'import/no-extraneous-dependencies': 'error',
            'import/no-named-as-default': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-unresolved': 'error',
            'jsx-a11y/label-has-associated-control': 'off',
            'react/default-props-match-prop-types': 'error',
            'react/destructuring-assignment': 'error',
            'react/forbid-prop-types': 'error',
            'react/jsx-no-bind': 'error',
            'react/jsx-sort-props': 'error',
            'react/no-access-state-in-setstate': 'error',
            'react/no-array-index-key': 'error',
            'react/no-this-in-sfc': 'off',
            'react/no-unknown-property': 'error',
            'react/no-unused-prop-types': 'error',
            'react/prop-types': 'error',
            'react/sort-comp': 'error',
            'no-promise-executor-return': 'error',
            'no-undef': 'error',
            'no-unused-expressions': 'error',
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
                        Function: true,
                        Object: true,
                        object: true,
                        '{}': true,
                    },
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-use-before-define': ['error'],
        },
    },
];
