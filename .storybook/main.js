const path = require('path');
const sass = require('sass');
const process = require('process/browser');

module.exports = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-themes',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    webpackFinal: async config => {
        // Reset and simplify rules
        config.module.rules = config.module.rules.filter(
            rule => !rule.test || (!String(rule.test).includes('js') && !String(rule.test).includes('ts')),
        );

        // Single rule for our source files
        config.module.rules.push({
            test: /\.(js|jsx|ts|tsx)$/,
            include: path.resolve(__dirname, '../src'),
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    configFile: path.resolve(__dirname, '.babelrc'),
                },
            },
        });

        // Ensure proper module resolution
        config.resolve = {
            ...config.resolve,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            fallback: {
                ...config.resolve?.fallback,
                process,
            },
        };

        // Handle CSS Modules
        config.module.rules.push({
            test: /\.module\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[local]--[hash:base64:5]',
                        },
                        sourceMap: true,
                        importLoaders: 2,
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: sass,
                        sourceMap: true,
                        sassOptions: {
                            includePaths: [path.resolve(__dirname, '../src/styles')],
                        },
                    },
                },
            ],
            include: path.resolve(__dirname, '../src'),
        });

        // Handle global styles
        config.module.rules.push({
            test: /(?<!\.module)\.scss$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        importLoaders: 2,
                    },
                },
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: sass,
                        sourceMap: true,
                        sassOptions: {
                            includePaths: [path.resolve(__dirname, '../src/styles')],
                        },
                    },
                },
            ],
            include: path.resolve(__dirname, '../src'),
        });

        // Add resolve extensions
        config.resolve.extensions.push('.ts', '.tsx');

        return config;
    },
    docs: {
        autodocs: true,
    },
};
