const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConf = require('../scripts/webpack.config.js');

const shouldIncludeAllSupportedBrowsers =
    process.env.NODE_ENV === 'production' || process.env.BROWSERSLIST_ENV === 'production';
const language = process.env.LANGUAGE;
const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;

module.exports = async ({ config }) => {
    config.plugins = [...webpackConfig.plugins, ...config.plugins];
    config.resolve.extensions = [...config.resolve.extensions, ...webpackConfig.resolve.extensions];
    config.resolve.alias = {
        ...config.resolve.alias,
        'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
        'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
    };
    config.module.rules.push(
        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: [{ loader: 'babel-loader' }, { loader: 'react-docgen-typescript-loader' }],
        },
        {
            test: /\.(js?|ts?)$/,
            exclude: /node_modules\/(?!(box-annotations)\/).*/,
            loader: 'source-map-loader',
            enforce: 'pre',
        },
    );
    if (shouldIncludeAllSupportedBrowsers) {
        config.module.rules.push({
            test: /\.(js|ts|tsx)$/,
            include: [
                /node_modules\/@hapi\/address/,
                /node_modules\/react-intl/,
                /node_modules\/intl-messageformat-parser/,
                /node_modules\/intl-messageformat/,
            ],
            loader: 'babel-loader',
            options: {
                babelrc: false,
                compact: false,
                configFile: path.resolve('babel.config.js'),
            },
        });
    }
    return config;
};
