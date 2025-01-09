/* eslint-disable */
// @ts-nocheck

import path from 'path';

const language = process.env.LANGUAGE;

const config: {
    stories: string[];
    addons: (string | { name: string; options: { sass: { implementation: any } } })[];
    framework: { name: string };
    staticDirs: string[];
    webpackFinal: (config: any) => Promise<any>;
    typescript: any;
} = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-styling',
            options: {
                sass: {
                    implementation: require('sass'),
                },
            },
        },
        '@storybook/addon-styling-webpack',
        '@storybook/addon-docs',
        '@storybook/addon-webpack5-compiler-babel',
        '@chromatic-com/storybook',
        'storybook-react-intl',
    ],

    framework: {
        name: '@storybook/react-webpack5',
    },

    staticDirs: ['public'],

    webpackFinal: async (config: any) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.

        // Ensure resolve exists and add extensions
        config.resolve = config.resolve || {};
        config.resolve.extensions = [...(config.resolve.extensions || []), '.css', '.scss', '.sass'];

        // Add aliases
        config.resolve.alias = {
            // @ts-ignore
            ...config.resolve.alias,
            'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
            'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            'msw/native': path.resolve('node_modules/msw/lib/native/index.mjs'),
        };

        // Ensure module and rules exist
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];

        // Find and remove any existing CSS rules
        config.module.rules = config.module.rules.filter(
            (rule: any) => !(rule.test && rule.test.toString().includes('css')),
        );

        // Add CSS/SCSS loader configuration
        config.module.rules.push(
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                auto: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                ],
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: {
                                auto: true,
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
        );

        return config;
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
};

export default config;
