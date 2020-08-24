const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd
const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`
const jsLoader = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename(`js`),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devServer: {
    port: 3000,
    hot: isDev,
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    // clear old bundles
    new CleanWebpackPlugin(),
    // The HtmlWebpackPlugin simplifies creation of
    // HTML files to serve your webpack bundles.
    // This is especially useful for webpack bundles
    // that include a hash in the filename
    // which changes every compilation.
    // You can either let the plugin generate an HTML
    // file for you, supply your own template
    // using lodash templates, or use your own loader.
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        removeWhitespace: isProd,
      },
    }),
    // copies individual files and directories,
    // which already exist, to the bundle
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    // This plugin extract CSS into separate files.
    // It creates a CSS file per JS file which contains CSS.
    // It supports On-Demand-Loading of CSS and SourceMaps
    new MiniCssExtractPlugin({
      filename: filename(`css`),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoader(),
      },
    ],
  },
}
