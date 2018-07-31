const path = require('path');
const packageJSON = require('../package.json');
const TranslationsPlugin = require('./TranslationsPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const license = require('./license');

const DefinePlugin = webpack.DefinePlugin;
const BannerPlugin = webpack.BannerPlugin;
const noReactSuffix = '.no.react';
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const language = process.env.LANGUAGE;
const react = process.env.REACT === 'true';
const token = process.env.TOKEN; // used for examples only
const folderId = process.env.FOLDERID; // used for examples only
const fileId = process.env.FILEID; // used for examples only
const outputDir = process.env.OUTPUT;
const locale = language.substr(0, language.indexOf('-'));
const version = isRelease ? packageJSON.version : 'dev';
const outputPath = outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language);
const entries = {
    picker: path.resolve('src/wrappers/ContentPickers.js'),
    uploader: path.resolve('src/wrappers/ContentUploader.js'),
    explorer: path.resolve('src/wrappers/ContentExplorer.js'),
    tree: path.resolve('src/wrappers/ContentTree.js'),
    preview: path.resolve('src/wrappers/ContentPreview.js'),
    sidebar: path.resolve('src/wrappers/ContentSidebar.js')
};
const entriesToBuild =
    typeof process.env.ENTRY === 'string'
        ? {
            [process.env.ENTRY]: entries[process.env.ENTRY]
        }
        : entries;

function getConfig(isReactExternalized) {
    const config = {
        bail: true,
        entry: entriesToBuild,
        output: {
            path: outputPath,
            filename: `[name]${isReactExternalized ? noReactSuffix : ''}.js`,
            publicPath: `/${version}/${language}/`
        },
        resolve: {
            modules: ['src', 'node_modules'],
            alias: {
                'examples':  path.join(__dirname, '../examples/src'),
                'react-intl-locale-data': path.resolve(`node_modules/react-intl/locale-data/${locale}`),
                'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
                'box-react-ui-locale-data': path.resolve(`node_modules/box-react-ui/i18n/${language}`),
                moment: path.resolve('src/util/MomentShim') // Hack to leverage Intl instead
            }
        },
        devServer: {
            host: '0.0.0.0'
        },
        resolveLoader: {
            modules: [path.resolve('src'), path.resolve('node_modules')]
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/
                },
                {
                    test: /\.s?css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
                }
            ]
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
                    BABEL_ENV: JSON.stringify(process.env.BABEL_ENV)
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    discardComments: { removeAll: true },
                    safe: true
                }
            }),
            new BannerPlugin(license)
        ],
        stats: {
            assets: true,
            colors: true,
            version: false,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            children: false
        }
    };

    if (isDev) {
        config.devtool = 'source-map';
        config.plugins.push(new TranslationsPlugin());
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true
            })
        );
    }

    if (isRelease && language === 'en-US') {
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

    if (isReactExternalized) {
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM'
        };
    }

    return config;
}

module.exports = isDev ? [getConfig(false), getConfig(true)] : getConfig(!react);
