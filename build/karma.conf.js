const webpackConfig = require('./webpack.karma.config');

const getTestFile = (src) => {
    if (!src) {
        return 'src/**/*-test.js';
    }
    if (src.endsWith('/')) {
        return `src/${src}**/*-test.js`;
    }
    const frags = src.split('/');
    const fileName = frags[frags.length - 1];
    if (!fileName) {
        throw new Error('Incorrect path to source file');
    }

    const path = src.replace(fileName, '');
    const base = path ? `src/${path}` : 'src';
    return `${base}/__tests__/${fileName}-test.js`;
};

module.exports = (config) => config.set({
    autoWatch: false,

    basePath: '..',

    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 100000,

    captureConsole: true,

    colors: true,

    coverageReporter: {
        check: {
            global: {
                statements: 10, // 95
                branches: 10, // 95
                functions: 10, // 93
                lines: 10 // 90
            }
        },
        reporters: [
            // { BROKEN DUE TO VERSIONS ISSUES
            //     type: 'html',
            //     dir: 'reports/coverage'
            // },
            { type: 'text' },
            { type: 'cobertura', dir: 'reports/coverage/cobertura' }
        ]
    },

    junitReporter: {
        outputDir: 'reports/coverage/junit',
        outputFile: 'junit.xml'
    },

    frameworks: [
        'mocha',
        'sinon-stub-promise',
        'chai-sinon',
        'chai',
        'sinon'
    ],

    files: [
        'node_modules/babel-polyfill/dist/polyfill.js',
        getTestFile(config.src)
    ],

    exclude: [],

    preprocessors: {
        'src/**/*-test.js': ['webpack', 'sourcemap']
    },

    phantomjsLauncher: {
        exitOnResourceError: true
    },

    port: 9876,

    logLevel: config.LOG_INFO,

    reporters: ['mocha', 'coverage', 'junit'],

    singleRun: true,

    webpack: webpackConfig,

    webpackMiddleware: {
        noInfo: true
    }
});
