const path = require('path');
const os = require('os');

const CircularDependencyPlugin = require('circular-dependency-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { BannerPlugin, DefinePlugin, IgnorePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const license = require('./license');
const packageJson = require('../package.json');

const isDevBuild = process.env.NODE_ENV === 'development';
const isProdBuild = process.env.NODE_ENV === 'production';
const version = isProdBuild ? packageJson.version : 'dev';

const hasAllBrowserSupport = isProdBuild || process.env.BROWSERSLIST_ENV === 'production';
const hasBundleAnalysis = process.env.BUNDLE_ANALYSIS === 'true';
const hasReact = process.env.REACT === 'true';

const language = process.env.LANGUAGE || 'en-US';
const entryPoint = process.env.ENTRY;
const outputDir = process.env.OUTPUT;

// Optimize for number of CPU cores
const numCPUs = os.cpus().length;

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
            // Optimize chunk naming for better caching
            chunkFilename: '[name].[contenthash].js',
            // Clean output directory
            clean: true,
        },

        resolve: {
            modules: ['src', 'node_modules'],
            extensions: ['.tsx', '.ts', '.js'],
            alias: {
                'box-ui-elements-locale-data': path.resolve(`i18n/bundles/${language}`),
                'box-locale-data': path.resolve(`node_modules/@box/cldr-data/locale-data/${language}`),
            },
            // Cache resolved modules for faster builds
            cacheWithContext: false,
        },

        resolveLoader: {
            modules: [path.resolve('src'), path.resolve('node_modules')],
        },

        // Enable persistent caching for faster rebuilds
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename],
            },
            cacheDirectory: path.resolve('.webpack-cache'),
        },

        devServer: {
            host: '0.0.0.0',
            // Enable hot module replacement for faster development
            hot: true,
            // Optimize dev server performance
            compress: true,
            client: {
                overlay: false,
            },
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
                    test: /\.(ts|tsx)$/,
                    // Use esbuild-loader for TypeScript files
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'esbuild-loader',
                            options: {
                                loader: 'tsx',
                                target: 'es2020',
                                // Enable source maps for debugging
                                sourcemap: isDevBuild,
                                // Optimize for production builds
                                minify: isProdBuild,
                                // Enable tree shaking
                                treeShaking: true,
                                // Optimize for bundle size
                                keepNames: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.(js|mjs)$/,
                    // Use babel-loader for JavaScript files to handle modern syntax
                    exclude: hasAllBrowserSupport
                        ? /@babel(?:\/|\\{1,2})runtime|pikaday|core-js/
                        : /node_modules\/(?!@box\/cldr-data)/, // Exclude node_modules except for @box/cldr-data which is needed for i18n
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                cacheCompression: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.s?css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // Enable CSS modules if needed
                                modules: false,
                                // Optimize CSS processing
                                importLoaders: 2,
                                sourceMap: isDevBuild,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: isDevBuild,
                                postcssOptions: {
                                    plugins: [
                                        'autoprefixer',
                                        // Add cssnano for production builds
                                        ...(isProdBuild ? ['cssnano'] : []),
                                    ],
                                },
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDevBuild,
                                // Optimize Sass compilation
                                sassOptions: {
                                    outputStyle: isProdBuild ? 'compressed' : 'expanded',
                                },
                            },
                        },
                    ],
                },
            ],
        },

        // Optimize performance settings
        performance: {
            maxAssetSize: 2000000,
            maxEntrypointSize: 2000000,
            // Add hints for optimization
            hints: isProdBuild ? 'warning' : false,
        },

        // Add optimization settings
        optimization: {
            // Enable tree shaking
            usedExports: true,
            sideEffects: false,
            // Optimize module concatenation
            concatenateModules: isProdBuild,
            // Split chunks for better caching
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            },
            // Optimize runtime chunk
            runtimeChunk: 'single',
            // Minimize in production
            minimize: isProdBuild,
            minimizer: [
                // Use Terser for JavaScript minification
                new TerserPlugin({
                    parallel: numCPUs,
                    terserOptions: {
                        compress: {
                            drop_console: isProdBuild,
                            drop_debugger: isProdBuild,
                            pure_funcs: isProdBuild ? ['console.log'] : [],
                        },
                        mangle: {
                            safari10: true,
                        },
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
                // Use CSS minimizer
                new CssMinimizerPlugin({
                    parallel: numCPUs,
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                                normalizeWhitespace: true,
                                minifyFontValues: true,
                                minifySelectors: true,
                            },
                        ],
                        processorOptions: {
                            safe: true,
                        },
                    },
                }),
            ],
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
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css',
                ignoreOrder: true,
            }),
            new IgnorePlugin({
                resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
            }),
            new NodePolyfillPlugin(),
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
            // Add more detailed stats for optimization
            modules: false,
            reasons: false,
            warnings: true,
            errors: true,
        },

        // Enable source maps for development
        devtool: isDevBuild ? 'eval-source-map' : false,
    };

    if (isDevBuild) {
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
