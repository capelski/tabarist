const webpack = require('webpack');
const { merge } = require('webpack-merge');
const firebaseConfig = require('../firebase-config.json');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_USE_FIREBASE: true,
      WEBPACK_FIREBASE_CONFIG: JSON.stringify(firebaseConfig),
    }),
  ],
});
