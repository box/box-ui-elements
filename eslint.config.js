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
                'error',
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
            ], // enabled with appropriate devDependencies exceptions
            'import/no-named-as-default': 'error', // enabled and fixed with inline disables
            'import/no-named-as-default-member': 'error', // enabled - no issues found
            'import/no-unresolved': 'off', // requires import resolver configuration - skipping
            'jsx-a11y/label-has-associated-control': 'error', // enabled - no issues found
            'react/default-props-match-prop-types': 'error', // enabled - no issues found
            'react/destructuring-assignment': 'error', // enabled and fixed
            'react/forbid-prop-types': 'error', // enabled and fixed
            'react/jsx-no-bind': 'error', // enabled and fixed
            'react/jsx-sort-props': 'error', // enabled and fixed
            'react/no-access-state-in-setstate': 'error', // enabled and fixed
            'react/no-array-index-key': 'error', // enabled and fixed
            'react/no-this-in-sfc': 'error', // enabled - no issues found
            'react/no-unknown-property': 'error', // enabled - no issues found
            'react/no-unused-prop-types': 'error', // enabled - no issues found
            'react/prop-types': 'error', // enabled and fixed
            'react/sort-comp': 'error', // enabled and fixed
            'no-promise-executor-return': 'error', // enabled - no issues found
            'no-undef': 'error', // enabled and fixed
            'no-unused-expressions': 'error', // enabled - no issues found
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
                        Function: true, // enabled and fixed
                        Object: true, // enabled and fixed
                        object: true, // enabled and fixed
                        '{}': true, // enabled and fixed
                    },
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'error', // enabled and fixed
            '@typescript-eslint/explicit-module-boundary-types': 'error', // enabled and fixed
            '@typescript-eslint/no-non-null-assertion': 'error', // enabled and fixed
            '@typescript-eslint/no-shadow': ['error'],
            '@typescript-eslint/no-use-before-define': ['error'],
        },
    },
];
