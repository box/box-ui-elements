const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'DependencyTest.js'),
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
        },
    },
    devServer: {
        static: {
            directory: __dirname,
        },
        port: 3000,
        allowedHosts: 'all',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
};
