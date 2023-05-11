import { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const language = process.env.LANGUAGE;

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        {
            name: '@storybook/addon-styling',
            options: {
                sass: {
                    // Require your Sass preprocessor here
                    implementation: require('sass'),
                },
            },
        },
        'storybook-addon-intl',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config, { configType }) => {
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
        };

        return config;
    },
};
export default config;
