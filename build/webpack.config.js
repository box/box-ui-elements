const path = require('path');
const packageJSON = require('../package.json');
const commonConfig = require('./webpack.common.config');
const TranslationsPlugin = require('./TranslationsPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const noReactSuffix = '.no.react';
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const language = process.env.LANGUAGE;
const outputDir = process.env.OUTPUT;
const version = isRelease ? packageJSON.version : 'dev';
const outputPath = outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language);

function getConfig(isReactExternalized) {
    const config = Object.assign(commonConfig(language), {
        entry: {
            picker: path.resolve('src/wrappers/ContentPickers.js'),
            uploader: path.resolve('src/wrappers/ContentUploader.js'),
            explorer: path.resolve('src/wrappers/ContentExplorer.js'),
            tree: path.resolve('src/wrappers/ContentTree.js'),
            preview: path.resolve('src/wrappers/ContentPreview.js'),
            sidebar: path.resolve('src/wrappers/ContentSidebar.js')
        },
        output: {
            path: outputPath,
            filename: `[name]${isReactExternalized ? noReactSuffix : ''}.js`,
            publicPath: `/${version}/${language}/`
        }
    });

    if (isDev) {
        config.devtool = 'inline-source-map';
        config.plugins.push(new TranslationsPlugin());
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true
            })
        );
    }

    if (isRelease) {
        config.plugins.push(
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                uglifyOptions: {
                    ecma: 5,
                    compress: {
                        // @NOTE: reduce_vars: true breaks the code
                        reduce_vars: false
                    }
                }
            })
        );
        if (language === 'en-US') {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: path.resolve(`reports/webpack-stats${isReactExternalized ? '' : '-react'}.html`),
                    generateStatsFile: true,
                    statsFilename: path.resolve(`reports/webpack-stats${isReactExternalized ? '' : '-react'}.json`)
                })
            );
        }
    }

    if (isReactExternalized) {
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM'
        };
    }

    return config;
}

module.exports = [getConfig(true), getConfig(false)];
