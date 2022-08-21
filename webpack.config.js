const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    optimization: {
        usedExports: true,
    },
    entry: './src/js/bundle.js',
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: path.join(__dirname, './build'),
        publicPath: "/"
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
    devServer: {
        open: true,
        hot: true,
        compress: true,
        static: path.join(__dirname, 'public'),
        historyApiFallback: true,
    },
    performance: {
        hints: false
    }
}