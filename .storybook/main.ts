import path from 'path';

const language = process.env.LANGUAGE;

const config: { webpackFinal: (config: any) => Promise<any>; stories: string[]; framework: { name: string }; addons: (string | { name: string; options: { sass: { implementation: any } } })[] } = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
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
        '@storybook/addon-styling-webpack'
    ],
    framework: {
        name: '@storybook/react-webpack5',
    },
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
        };

        return config;
    },
};
export default config;
