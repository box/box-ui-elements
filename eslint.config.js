// eslint-disable-next-line global-require
const { FlatCompat } = require('@eslint/eslintrc');
// eslint-disable-next-line global-require
const js = require('@eslint/js');

// Plugins
// eslint-disable-next-line global-require
const cypress = require('eslint-plugin-cypress/flat');
// eslint-disable-next-line global-require
const babelParser = require('@babel/eslint-parser');
// eslint-disable-next-line global-require
const flowSyntax = require('@babel/plugin-syntax-flow');

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
    baseDirectory: __dirname,
});

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
            'styleguide/',
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
    {
        files: ['**/*.js', '**/*.flow.js', '**/*.jsx'],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    plugins: [flowSyntax],
                    rootMode: 'upward-optional',
                },
                sourceType: 'module',
                ecmaVersion: 'latest',
                ecmaFeatures: {
                    jsx: true,
                    modules: true,
                },
            },
        },
        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.flow.js'],
                },
            },
            'import/parsers': {
                '@babel/eslint-parser': ['.js', '.jsx', '.flow.js'],
            },
        },
    },
    cypress.configs.recommended,
    {
        rules: {
            camelcase: 'off',
            'class-methods-use-this': 'off',
            'import/export': 'error', // enabled and fixed
            'import/no-extraneous-dependencies': [
                'warn',
                {
                    devDependencies: [
                        '**/__tests__/**',
                        '**/*.test.{js,jsx,ts,tsx}',
                        '**/*.stories.{js,jsx,ts,tsx}',
                        '**/stories/**',
                        '**/test/**',
                        'test/**',
                        'scripts/**',
                        '**/webpack.config.js',
                        '**/styleguide.config.js',
                    ],
                },
            ], // fixme - in progress
            'import/no-named-as-default': 'error', // enabled and fixed with inline disables
            'import/no-named-as-default-member': 'error', // enabled - no issues found
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
        languageOptions: {
            // eslint-disable-next-line global-require
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
        plugins: {
            // eslint-disable-next-line global-require
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
                node: {
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
                    moduleDirectory: ['node_modules', 'src'],
                    paths: ['src'],
                },
            },
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
            'import/core-modules': [],
            'import/ignore': ['\\.(css|scss|less|svg|json)$'],
        },
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
