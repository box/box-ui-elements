const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConf = require('../scripts/webpack.config.js');

const language = process.env.LANGUAGE;
const webpackConfig = Array.isArray(webpackConf) ? webpackConf[0] : webpackConf;
const locale = language ? language.substr(0, language.indexOf('-')) : 'en';

module.exports = async ({ config, mode }) => {
    config.plugins = [...webpackConfig.plugins, ...config.plugins];
    config.resolve.alias = {
        ...config.resolve.alias,
        'react-intl-locale-data': path.resolve(`node_modules/react-intl/locale-data/${locale}`),
        'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
    };
    config.module.rules.push({
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
    });
    return config;
};
