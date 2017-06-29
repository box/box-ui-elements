const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const BannerPlugin = webpack.BannerPlugin;

module.exports = {
    bail: true,
    entry: {
        picker: path.resolve('src/components/ContentPicker/index.js'),
        explorer: path.resolve('src/components/ContentExplorer/index.js'),
        uploader: path.resolve('src/components/ContentUploader/index.js'),
        tree: path.resolve('src/components/ContentTree/index.js')
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js'
    },
    resolve: {
        modules: ['src', 'node_modules']
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
        new BannerPlugin('Box UI Elements | Copyright 2016-2017 Box | License: https://developer.box.com/docs/box-ui-kit-software-license-agreement'),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
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
