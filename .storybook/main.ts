import path from 'path';
import sass from 'sass';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';

import TranslationsPlugin from '@box/frontend/webpack/TranslationsPlugin';
import { translationDependencies } from '../scripts/i18n.config';

// Resolve issues with pipeline failures due to FIPS compliance
// https://github.com/webpack/webpack/issues/13572#issuecomment-923736472
const crypto = require('crypto'); // eslint-disable-line
const crypto_createHash = crypto.createHash;
crypto.createHash = algorithm => {
    console.log('this is the algorithm used by crypto', algorithm);
    crypto_createHash('sha256');
};

const language = process.env.LANGUAGE;

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
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
                                    implementation: sass,
                                },
                            },
                        ],
                    },
                ],
            },
        },
        '@storybook/addon-links',
        '@storybook/addon-webpack5-compiler-babel',
        'storybook-react-intl',
    ],

    webpackFinal: async (webpack: Configuration = {}) => {
        webpack.cache = false;

        webpack.resolve = webpack.resolve || {};
        webpack.resolve.alias = {
            ...webpack.resolve.alias,
            'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
            'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            'msw/native': path.resolve('node_modules/msw/lib/native/index.mjs'),
        };

        webpack.plugins = webpack.plugins || [];
        webpack.plugins.push(
            new TranslationsPlugin({
                generateBundles: true,
                additionalMessageData: translationDependencies.map(pkg => `${pkg}/i18n/[language]`),
            }),
        );

        return webpack;
    },

    core: {
        disableTelemetry: true,
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },

    staticDirs: ['public'],
};

export default config;
