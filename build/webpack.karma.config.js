const merge = require('deepmerge');
const path = require('path');
const IgnorePlugin = require('webpack').IgnorePlugin;
const commonConfig = require('./webpack.common.config');

const baseConfig = commonConfig('en-US');

const config = merge(baseConfig, {
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            sinon: 'sinon/pkg/sinon',
            'react-intl': path.resolve('build/react-intl-mocks.js'),
            intl: path.resolve('build/lib-intl-mock.js'),
            'i18n-locale-data': path.resolve('node_modules/react-intl/locale-data/en.js')
        }
    },
    externals: {
        mocha: 'mocha',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
        'react-dom/test-utils': true,
        'react-test-renderer/shallow': true
    }
});

config.plugins.push(
    new IgnorePlugin(/react\/addons/),
    new IgnorePlugin(/react\/lib\/ReactContext/),
    new IgnorePlugin(/react\/lib\/ExecutionEnvironment/)
);

module.exports = config;
