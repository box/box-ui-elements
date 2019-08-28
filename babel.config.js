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
    plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-flow-strip-types',
        '@babel/plugin-transform-object-assign',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        [
            'react-intl',
            {
                enforceDescriptions: true,
                messagesDir: './i18n/json',
            },
        ],
    ],
    env: {
        dev: {
            plugins: [
                'flow-react-proptypes',
                [
                    'react-intl',
                    {
                        enforceDescriptions: false,
                    },
                ],
            ],
        },
        npm: {
            plugins: [['react-remove-properties', { properties: ['data-testid'] }]],
        },
        production: {
            plugins: [['react-remove-properties', { properties: ['data-resin-target', 'data-testid'] }]],
        },
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                'dynamic-import-node', // https://github.com/facebook/jest/issues/5920
            ],
        },
    },
};
