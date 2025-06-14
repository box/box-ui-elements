import path from 'path';
import sass from 'sass';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';

import TranslationsPlugin from '@box/frontend/webpack/TranslationsPlugin';
import { translationDependencies } from '../scripts/i18n.config';

const language = process.env.LANGUAGE;

const config: StorybookConfig = {
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
                                    implementation: sass,
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
        options: {},
    },

    staticDirs: ['public'],

    webpackFinal: async (webpack: Configuration = {}) => {
        webpack.resolve = webpack.resolve ?? {};
        webpack.resolve.alias = {
            ...webpack.resolve.alias,
            'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
            'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            'msw/native': path.resolve('node_modules/msw/lib/native/index.mjs'),
        };

        webpack.plugins = webpack.plugins ?? [];
        webpack.plugins.push(
            new TranslationsPlugin({
                generateBundles: true,
                additionalMessageData: translationDependencies.map(pkg => `${pkg}/i18n/[language]`),
            }),
        );

        return webpack;
    },

    typescript: {
        reactDocgen: 'react-docgen-typescript',
    },
};

export default config;
