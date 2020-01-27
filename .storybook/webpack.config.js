const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConf = require('../scripts/webpack.config.js');

const language = process.env.LANGUAGE;
const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;

module.exports = async ({ config }) => {
    config.plugins = [...webpackConfig.plugins, ...config.plugins];
    config.resolve.extensions = [...config.resolve.extensions, ...webpackConfig.resolve.extensions];
    config.resolve.alias = {
        ...config.resolve.alias,
        'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
    };
    config.module.rules.push(
        {
            test: /\.scss$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: [
                { loader: 'babel-loader' },
                { loader: 'react-docgen-typescript-loader' }
            ]
        },
    );
    return config;
};
