const fs = require('fs');
const path = require('path');
const TranslationsPlugin = require('@box/frontend/webpack/TranslationsPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RsyncPlugin = require('@box/frontend/webpack/RsyncPlugin');
const { translationDependencies } = require('../i18n.config');
const packageJSON = require('../package.json');
const rsyncConf = fs.existsSync('scripts/rsync.json') ? require('./rsync.json') : {}; // eslint-disable-line
const license = require('./license');

const { BannerPlugin, DefinePlugin, IgnorePlugin } = webpack;
const noReactSuffix = '.no.react';
const isRsync = process.env.RSYNC === 'true' && rsyncConf.location;
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const language = process.env.LANGUAGE;
const react = process.env.REACT === 'true';
const shouldAnalyzeBundles = process.env.BUNDLE_ANALYSIS === 'true';
const shouldIncludeAllSupportedBrowsers = isRelease || process.env.BROWSERSLIST_ENV === 'production';
const outputDir = process.env.OUTPUT;
const version = isRelease ? packageJSON.version : 'dev';
const outputPath = outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language);
const Translations = new TranslationsPlugin({
    generateBundles: true,
    additionalMessageData: translationDependencies.map(pkg => `${pkg}/i18n/[language]`),
});
const entries = {
    picker: path.resolve('src/elements/wrappers/ContentPickers.js'),
    uploader: path.resolve('src/elements/wrappers/ContentUploader.js'),
    explorer: path.resolve('src/elements/wrappers/ContentExplorer.js'),
    preview: path.resolve('src/elements/wrappers/ContentPreview.js'),
    sidebar: path.resolve('src/elements/wrappers/ContentSidebar.js'),
    openwith: path.resolve('src/elements/wrappers/ContentOpenWith.js'),
    sharing: path.resolve('src/elements/wrappers/ContentSharing.js'),
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
            hashFunction: 'xxhash64',
        },
        resolve: {
            modules: ['src', 'node_modules'],
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
                'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            },
        },
        devServer: {
            host: '0.0.0.0',
        },
        resolveLoader: {
            modules: [path.resolve('src'), path.resolve('node_modules')],
        },
        module: {
            rules: [
                {
                    test: /\.m?js/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(js|mjs|ts|tsx)$/,
                    loader: 'babel-loader',
                    // For webpack dev build perf we want to exclude node_modules unless we want to support legacy browsers like IE11
                    exclude: shouldIncludeAllSupportedBrowsers
                        ? /@babel(?:\/|\\{1,2})runtime|pikaday|core-js/
                        : /node_modules\/(?!@box\/cldr-data)/, // Exclude node_modules except for @box/cldr-data which is needed for i18n
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
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    BABEL_ENV: JSON.stringify(process.env.BABEL_ENV),
                },
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                ignoreOrder: true,
            }),
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                    processorOptions: {
                        safe: true,
                    },
                },
            }),
            new BannerPlugin(license),
            new IgnorePlugin({
                resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
            }),
        ],
        stats,
    };

    config.plugins.push(Translations);

    if (isDev) {
        config.devtool = 'source-map';
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true,
            }),
        );
    }

    if (isRsync) {
        config.plugins.push(new RsyncPlugin('dist/.', rsyncConf.location, 'elements assets'));
    }

    if (isRelease || isRsync) {
        // Disable code splitting: https://webpack.js.org/api/module-methods/#magic-comments
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
