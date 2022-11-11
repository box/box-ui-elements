import type {StorybookConfig} from '@storybook/core-common';

const path = require('path');
const webpackConf = require('../scripts/webpack.config.js');
const shouldIncludeAllSupportedBrowsers =
    process.env.NODE_ENV === 'production' || process.env.BROWSERSLIST_ENV === 'production';
const language = process.env.LANGUAGE;
const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;


const config: StorybookConfig = {
    core: {
        builder: 'webpack5',
    },

    stories: ['../src/**/*.stories.@(tsx|js)'],
    addons: [
        '@storybook/addon-essentials',
        // '@storybook/addon-links',
        // {
        //     name: '@storybook/addon-docs',
        //     options: {
        //         configureJSX: true,
        //         babelOptions: {},
        //     },
        // },
        // 'storybook-react-intl',
    ],
    framework: '@storybook/react',
}

module.exports = config;
