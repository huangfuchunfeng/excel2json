/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin
module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  new VueLoaderPlugin(),
  new webpack.DefinePlugin({
    '__VUE_OPTIONS_API__': JSON.stringify(true),
    '__VUE_PROD_DEVTOOLS__': JSON.stringify(false)
  })
];
