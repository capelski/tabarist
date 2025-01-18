const { resolve } = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, '..', 'docs'),
    publicPath: '/tabarist/',
  },
  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_USE_FIREBASE: false,
      WEBPACK_FIREBASE_CONFIG: JSON.stringify({}),
    }),
  ],
});
