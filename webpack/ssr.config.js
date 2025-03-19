const { resolve } = require('path');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  entry: './source/ssr.tsx',
  externals: [nodeExternals()],
  mode: 'production',
  output: {
    filename: 'ssr.js',
    path: resolve(__dirname, '..', 'functions', 'src', 'ssr'),
    libraryTarget: 'umd',
  },
  target: 'node',
});
