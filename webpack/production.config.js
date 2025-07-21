const { resolve } = require('path');
const { merge } = require('webpack-merge');
const { assetsFolder } = require('../source/html');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: resolve(__dirname, '..', 'dist', assetsFolder),
  },
});
