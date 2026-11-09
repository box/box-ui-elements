import path from 'path';
import sass from 'sass';
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';

import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import _webpack from 'webpack';

const { DefinePlugin } = _webpack;

const language = process.env.LANGUAGE;
const version = process.env.NODE_ENV === 'production' ? 'demo' : 'dev';

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },

    addons: [
        '@chromatic-com/storybook',
        '@storybook/addon-docs',
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
        '@storybook/addon-webpack5-compiler-babel',
        'storybook-react-intl',
    ],

    webpackFinal: async (webpack: Configuration = {}) => {
        webpack.resolve = webpack.resolve || {};
        webpack.resolve.alias = {
            ...webpack.resolve.alias,
            'box-ui-elements-locale-data': path.resolve(`i18n/bundles/${language}`),
            'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            // box-content-preview (devDependency) imports its box-ui-elements peer via
            // es/ paths; inside this repo those resolve to the src/ they are built from.
            'box-ui-elements/es': path.resolve('src'),
            'msw/native': path.resolve('node_modules/msw/lib/native/index.mjs'),
        };

        webpack.plugins = webpack.plugins || [];
        webpack.plugins.push(
            new DefinePlugin({
                __VERSION__: JSON.stringify(version),
            }),
            new NodePolyfillPlugin({
                additionalAliases: ['process'],
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
