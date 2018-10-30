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
            plugins: ['flow-react-proptypes'],
        },
        npm: {
            plugins: [
                [
                    'babel-plugin-transform-require-ignore',
                    {
                        extensions: ['.scss', '.css'],
                    },
                ],
            ],
        },
        test: {
            plugins: [
                '@babel/plugin-transform-modules-commonjs',
                [
                    'react-intl',
                    {
                        enforceDescriptions: false,
                    },
                ],
                [
                    'babel-plugin-transform-require-ignore',
                    {
                        extensions: ['.scss', '.css'],
                    },
                ],
            ],
        },
    },
};
