/* eslint-disable */
// @ts-nocheck

import path from 'path';

const language = process.env.LANGUAGE;

const TranslationsPlugin = require('@box/frontend/webpack/TranslationsPlugin');
const { translationDependencies } = require('../i18n.config');

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
            name: '@storybook/addon-styling-webpack',
            options: {
                rules: [
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader'],
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            'style-loader',
                            'css-loader',
                            {
                                loader: 'sass-loader',
                                options: {
                                    implementation: require('sass'),
                                },
                            },
                        ],
                    },
                ],
            },
        },
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

        // It's okay, Typescript. We know it's defined in this case.
        // @ts-ignore
        config.resolve.alias = {
            // @ts-ignore
            ...config.resolve.alias,
            'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
            'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            'msw/native': path.resolve('node_modules/msw/lib/native/index.mjs'),
        };

        config.plugins.push(
            new TranslationsPlugin({
                generateBundles: true,
                additionalMessageData: translationDependencies.map(pkg => `${pkg}/i18n/[language]`),
            }),
        );

        return {
            ...config,
            cache: {
                type: 'filesystem',
                hashAlgorithm: 'sha256',
            },
        };
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
};

export default config;
