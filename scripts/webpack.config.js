const path = require('path');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BannerPlugin, DefinePlugin, IgnorePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const license = require('../license');
const packageJson = require('../package.json');

const hasBundleAnalysis = process.env.BUNDLE_ANALYSIS === 'true';
const hasReact = process.env.REACT === 'true';
const isDevBuild = process.env.NODE_ENV === 'development';
const isProdBuild = process.env.NODE_ENV === 'production';

const hasAllBrowserSupport = isProdBuild || process.env.BROWSERSLIST_ENV === 'production';
const language = process.env.LANGUAGE;
const version = isProdBuild ? packageJson.version : 'dev';
const entryPoint = process.env.ENTRY;
const outputDir = process.env.OUTPUT;

const entries = {
    explorer: path.resolve('src/elements/wrappers/ContentExplorer.js'),
    openwith: path.resolve('src/elements/wrappers/ContentOpenWith.js'),
    picker: path.resolve('src/elements/wrappers/ContentPickers.js'),
    preview: path.resolve('src/elements/wrappers/ContentPreview.js'),
    sharing: path.resolve('src/elements/wrappers/ContentSharing.js'),
    sidebar: path.resolve('src/elements/wrappers/ContentSidebar.js'),
    uploader: path.resolve('src/elements/wrappers/ContentUploader.js'),
};

const getConfig = isReactBundle => {
    const config = {
        bail: true,

        entry: typeof entryPoint === 'string' ? { [entryPoint]: entries[entryPoint] } : entries,

        output: {
            filename: `[name]${isReactBundle ? '' : '.no.react'}.js`,
            path: outputDir ? path.resolve(outputDir) : path.resolve('dist', version, language),
            publicPath: `/${version}/${language}/`,
        },

        resolve: {
            modules: ['src', 'node_modules'],
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                'box-ui-elements-locale-data': path.resolve(`i18n/${language}`),
                'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            },
        },

        resolveLoader: {
            modules: [path.resolve('src'), path.resolve('node_modules')],
        },

        devServer: {
            host: '0.0.0.0',
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
                    // Exclude node_modules in development mode to improve build performance
                    exclude: hasAllBrowserSupport
                        ? /@babel(?:\/|\\{1,2})runtime|pikaday|core-js/
                        : /node_modules\/(?!@box\/cldr-data)/, // Exclude node_modules except for @box/cldr-data which is needed for i18n
                    loader: 'babel-loader',
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
            new BannerPlugin(license),
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
            new IgnorePlugin({
                resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
            }),
        ],

        stats: {
            assets: true,
            children: false,
            chunkModules: false,
            chunks: false,
            colors: true,
            hash: false,
            timings: true,
            version: false,
        },
    };

    if (isDevBuild) {
        config.devtool = 'source-map';

        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: true,
            }),
        );
    }

    if (isProdBuild) {
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

        if (language === 'en-US' && hasBundleAnalysis) {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                    reportFilename: path.resolve(`reports/webpack-stats${isReactBundle ? '-react' : ''}.html`),
                    generateStatsFile: true,
                    statsFilename: path.resolve(`reports/webpack-stats${isReactBundle ? '-react' : ''}.json`),
                }),
            );
        }
    }

    if (!isReactBundle) {
        config.externals = {
            react: 'React',
            'react-dom': 'ReactDOM',
        };
    }

    return config;
};

module.exports = isDevBuild ? [getConfig(true), getConfig(false)] : getConfig(hasReact);
