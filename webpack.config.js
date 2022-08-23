const path = require('path')
const { merge } = require('webpack-merge')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isDevelopment = process.env.NODE_ENV === 'development'

const basicConfig = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/bundle.jsx',
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, './build/'),
    publicPath: '/build/',
  },
  optimization: {
    usedExports: true,
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        options: {
          plugins: [
            ['import', { libraryName: 'antd', style: true }],
          ],
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        // modify
        test: /\.less$/i,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource',
      }],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      screens: path.resolve(__dirname, 'src/screens'),
      components: path.resolve(__dirname, 'src/components'),
      utils: path.resolve(__dirname, 'src/utils'),
      res: path.resolve(__dirname, 'res'),
    },
    extensions: ['.jsx', '.js', '.tsx', '.ts'],
  },
}

const devConfig = {
  optimization: {
    usedExports: false,
  },
  plugins: [
    new BundleAnalyzer(),
  ],
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    open: true,
    hot: true,
    compress: true,
    static: path.join(__dirname, 'public'),
    historyApiFallback: true,
  },
}

module.exports = isDevelopment ? merge(basicConfig, devConfig) : basicConfig
