const path = require('path');
const {merge} = require('webpack-merge')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isDevelopment = process.env.NODE_ENV === 'development'

const basicConfig = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/js/bundle.js',
    output: {
        filename: "[name].bundle.js",
        path: path.join(__dirname, './build/'),
        publicPath: "/build/"
    },
    optimization: {
        usedExports: true
    },
    module: {
        rules: [
            {
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
                test: /\.less$/i,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader",
                    options: {
                        lessOptions: {
                            javascriptEnabled: true,
                        }
                    }
                }
                ],
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: "asset/resource"
            }]
    },
}

const devConfig = {
    optimization: {
        usedExports: false,
    },
    plugins: [
        new BundleAnalyzer(),
    ],
    devServer: {
        open: true,
        hot: true,
        compress: true,
        static: path.join(__dirname, 'public'),
        historyApiFallback: true,
    },
}

module.exports = isDevelopment ? merge(basicConfig, devConfig) : basicConfig