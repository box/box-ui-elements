import path from 'path';
import remarkGfm from "remark-gfm";

const language = process.env.LANGUAGE;

const config: { webpackFinal: (config: any) => Promise<any>; staticDirs: string[]; stories: string[]; framework: { name: string }; docs: { autodocs: boolean }; addons: (string | { name: string; options: { sass: { implementation: any } } } | { name: string; options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: ((options?: (Options | null | undefined)) => undefined)[] } } } })[] } = {
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
        // tables and some other markdown features do not render correctly without this
        // https://storybook.js.org/docs/writing-docs/mdx#markdown-tables-arent-rendering-correctly
        {
            name: '@storybook/addon-docs'
        },
        '@storybook/addon-webpack5-compiler-babel',
        '@chromatic-com/storybook',
        'storybook-react-intl'
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

        return config;
    },
};

export default config;
