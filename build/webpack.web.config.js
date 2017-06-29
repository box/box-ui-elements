const path = require('path');
const commonConfig = require('./webpack.common.config');
const Json2PropsPlugin = require('./json-to-props-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const locales = require('./locales');

const noReactSuffix = '.no.react';
const i18n = path.resolve('src/i18n');
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const version = isRelease ? require('../package.json').version : 'dev';

function updateConfig(conf, locale, noReact, index) {
    const output = path.resolve('dist', version, locale);
    const config = Object.assign(conf, {
        entry: {
            picker: path.resolve('src/wrappers/ContentPickers.js'),
            uploader: path.resolve('src/wrappers/ContentUploader.js'),
            explorer: path.resolve('src/wrappers/ContentExplorer.js'),
            tree: path.resolve('src/wrappers/ContentTree.js')
        },
        output: {
            path: output,
            filename: `[name]${noReact ? noReactSuffix : ''}.js`,
            publicPath: `/${version}/${locale}/`
        }
    });

    if (isDev) {
        config.plugins.push(new Json2PropsPlugin(i18n));
        config.devtool = 'inline-source-map';
    }

    if (isRelease && index === 0) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: `../../../reports/webpack-stats${noReact ? '' : '-react'}.html`,
                generateStatsFile: true,
                statsFilename: `../../../reports/webpack-stats${noReact ? '' : '-react'}.json`
            })
        );
    }

    // Add no-react build checks
    if (noReact) {
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM'
        };
    }

    return config;
}

const localizedConfigs = locales.map((locale, index) => updateConfig(commonConfig(locale), locale, false, index));
const localizedConfigsNoReact = locales.map((locale, index) => updateConfig(commonConfig(locale), locale, true, index));

module.exports = localizedConfigs.concat(localizedConfigsNoReact);
