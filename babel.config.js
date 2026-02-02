module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
            },
        ],
        '@babel/preset-react',
        '@babel/preset-flow',
    ],
    overrides: [
        {
            test: ['./src/**/*.ts', './src/**/*.tsx', './node_modules/@box/**/*.ts', './node_modules/@box/**/*.tsx'],
            presets: [
                [
                    '@babel/preset-env',
                    {
                        modules: false,
                    },
                ],
                '@babel/preset-react',
                [
                    '@babel/preset-typescript',
                    {
                        isTSX: true,
                        allExtensions: true,
                    },
                ],
            ],
        },
    ],
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-flow-strip-types',
        '@babel/plugin-transform-class-properties', // Order matters: `transform-class-properties` must come after `transform-flow-strip-types`
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-transform-object-rest-spread',
        'babel-plugin-styled-components',
        [
            'react-intl',
            {
                messagesDir: './i18n/json',
            },
        ],
    ],
    env: {
        development: {
            plugins: ['flow-react-proptypes'],
        },
        production: {
            plugins: [['react-remove-properties', { properties: ['data-resin-target'] }]],
        },
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                'dynamic-import-node', // https://github.com/facebook/jest/issues/5920
            ],
        },
    },
};
