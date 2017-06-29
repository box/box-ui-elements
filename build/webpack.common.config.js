const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const getMessages = require('./extractTranslations');
const version = require('../package.json').version;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const license = require('./license');

const DefinePlugin = webpack.DefinePlugin;
const BannerPlugin = webpack.BannerPlugin;

module.exports = (language) => {
    const translations = getMessages(language);
    const locale = language.substr(0, language.indexOf('-'));
    return {
        bail: true,
        resolve: {
            modules: ['src', 'node_modules'],
            alias: {
                'i18n-locale-data': `react-intl/locale-data/${locale}`
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
                __LOCALE__: JSON.stringify(locale),
                __TRANSLATIONS__: JSON.stringify(translations),
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
};
