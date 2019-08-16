const path = require('path');
const TranslationsPlugin = require('@box/frontend/webpack/TranslationsPlugin.js');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safeParser = require('postcss-safe-parser');
const packageJSON = require('../package.json');
const license = require('./license');

const { BannerPlugin, DefinePlugin, IgnorePlugin } = webpack;
const noReactSuffix = '.no.react';
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const language = process.env.LANGUAGE;
const react = process.env.REACT === 'true';
const examples = process.env.EXAMPLES === 'true';
const shouldAnalyzeBundles = process.env.BUNDLE_ANALYSIS === 'true';
const shouldIncludeAllSupportedBrowsers = isRelease || process.env.BROWSERSLIST_ENV === 'production';
const token = process.env.TOKEN; // used for examples only
const folderId = process.env.FOLDERID; // used for examples only
const fileId = process.env.FILEID; // used for examples only
const outputDir = process.env.OUTPUT;
const locale = language ? language.substr(0, language.indexOf('-')) : 'en';
const version = isRelease ? packageJSON.version : 'dev';
const outputPath = outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language);
const Translations = new TranslationsPlugin();
const entries = {
    picker: path.resolve('src/elements/wrappers/ContentPickers.js'),
    uploader: path.resolve('src/elements/wrappers/ContentUploader.js'),
    explorer: path.resolve('src/elements/wrappers/ContentExplorer.js'),
    preview: path.resolve('src/elements/wrappers/ContentPreview.js'),
    sidebar: path.resolve('src/elements/wrappers/ContentSidebar.js'),
    openwith: path.resolve('src/elements/wrappers/ContentOpenWith.js'),
};
const entriesToBuild =
    typeof process.env.ENTRY === 'string'
        ? {
              [process.env.ENTRY]: entries[process.env.ENTRY],
          }
        : entries;

const stats = {
    assets: true,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false,
};

function getConfig(isReactExternalized) {
    const config = {
        bail: true,
        entry: entriesToBuild,
        output: {
            path: outputPath,
            filename: `[name]${isReactExternalized ? noReactSuffix : ''}.js`,
            publicPath: `/${version}/${language}/`,
        },
        resolve: {
            modules: ['src', 'node_modules'],
            alias: {
                'box-ui-elements/es': path.join(__dirname, '../src'), // for examples only
                examples: path.join(__dirname, '../examples/src'), // for examples only
                'react-intl-locale-data': path.resolve(`node_modules/react-intl/locale-data/${locale}`),
                'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
                'rsg-components/Wrapper': path.join(__dirname, '../examples/Wrapper'), // for examples only
            },
        },
        devServer: {
            host: '0.0.0.0',
            stats,
        },
        resolveLoader: {
            modules: [path.resolve('src'), path.resolve('node_modules')],
        },
        module: {
            rules: [
                {
                    test: /\.(js|mjs)$/,
                    loader: 'babel-loader',
                    // For webpack dev build perf we want to exlcude node_modules unless we want to support legacy browsers like IE11
                    exclude: shouldIncludeAllSupportedBrowsers ? /node_modules\/pikaday/ : /node_modules/,
                },
                {
                    test: /\.s?css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
                },
            ],
        },
        performance: {
            maxAssetSize: 2000000,
            maxEntrypointSize: 2000000,
        },
        plugins: [
            new DefinePlugin({
                __LANGUAGE__: JSON.stringify(language),
                __VERSION__: JSON.stringify(version),
                __TOKEN__: JSON.stringify(token), // used for examples only
                __FOLDERID__: JSON.stringify(folderId), // used for examples only
                __FILEID__: JSON.stringify(fileId), // used for examples only
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    BABEL_ENV: JSON.stringify(process.env.BABEL_ENV),
                },
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: { removeAll: true },
                    parser: safeParser,
                },
            }),
            new BannerPlugin(license),
            new IgnorePlugin({
                resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
            }),
        ],
        stats,
    };

    if (isDev) {
        config.devtool = 'source-map';
        config.plugins.push(Translations);

        if (!examples) {
            config.plugins.push(
                new CircularDependencyPlugin({
                    exclude: /node_modules/,
                    failOnError: true,
                }),
            );
        }
    }

    if (isRelease) {
        // For release builds, disable code splitting. https://webpack.js.org/api/module-methods/#magic-comments
        config.module.rules = [
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                options: {
                    search: 'webpackMode: "lazy"',
                    replace: 'webpackMode: "eager"',
                    flags: 'g',
                },
            },
            ...config.module.rules,
        ];
    }
    if (isRelease && language === 'en-US' && shouldAnalyzeBundles) {
        config.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: path.resolve(`reports/webpack-stats${isReactExternalized ? '' : '-react'}.html`),
                generateStatsFile: true,
                statsFilename: path.resolve(`reports/webpack-stats${isReactExternalized ? '' : '-react'}.json`),
            }),
        );
    }
    if (isReactExternalized) {
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM',
        };
    }
    return config;
}
module.exports = isDev ? [getConfig(false), getConfig(true)] : getConfig(!react);
