const webpack = require('webpack');
const path = require('path');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'production',
    optimization: {
        usedExports: true,
    },
    entry: './src/js/bundle.js',
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: path.join(__dirname, 'public'),
        publicPath: "/"
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/,
            options: {
                plugins: [
                    ['import', {libraryName: "antd", style: true}]
                ]
            },
        },
        {
            // modify
            test: [/\.css$/, /\.less$/],
            use: [
                {loader: 'style-loader'},
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                    },
                },
                {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        javascriptEnabled: true
                    }
                }
            ],
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        publicPath: "./",
                        limit: 10000
                    }
                }
            ]
        }]
    },
    devServer: {
        open: true,
        hot: true,
        compress: true,
        contentBase: path.join(__dirname, 'public'),
        historyApiFallback: true
    },
    plugins: [
        new BundleAnalyzer(),
        new webpack.HotModuleReplacementPlugin()
    ],
    performance: {
        hints: false
    }
}