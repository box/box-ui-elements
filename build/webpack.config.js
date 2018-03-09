const path = require('path');
const packageJSON = require('../package.json');
const TranslationsPlugin = require('./TranslationsPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const license = require('./license');

const DefinePlugin = webpack.DefinePlugin;
const BannerPlugin = webpack.BannerPlugin;
const noReactSuffix = '.no.react';
const isRelease = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'dev';
const language = process.env.LANGUAGE;
const outputDir = process.env.OUTPUT;
const locale = language.substr(0, language.indexOf('-'));
const version = isRelease ? packageJSON.version : 'dev';
const outputPath = outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language);


function getConfig(isReactExternalized) {
    const config = {
        bail: true,
        devtool: 'source-map',
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
        },
        resolve: {
            modules: ['src', 'node_modules'],
            alias: {
                'react-intl-locale-data': path.resolve(`node_modules/react-intl/locale-data/${locale}`),
                'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
                'box-react-ui-locale-data': path.resolve(`node_modules/box-react-ui/i18n/${language}`)
            }
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
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            {
                                loader: 'css-loader',
                                options: { importLoaders: 1 }
                            },
                            {
                                loader: 'postcss-loader'
                            },
                            {
                                loader: 'sass-loader'
                            }
                        ]
                    })
                }
            ]
        },
        plugins: [
            new BannerPlugin(license),
            new OptimizeCssAssetsPlugin({
                cssProcessorOptions: {
                    safe: true
                }
            }),
            new ExtractTextPlugin({
                filename: '[name].css',
                allChunks: true
            }),
            new DefinePlugin({
                __LANGUAGE__: JSON.stringify(language),
                __VERSION__: JSON.stringify(version),
                'process.env': {
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                    BABEL_ENV: JSON.stringify(process.env.BABEL_ENV)
                }
            })
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

module.exports = [getConfig(true), getConfig(false)];
