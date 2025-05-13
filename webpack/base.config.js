const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const { DefinePlugin } = require('webpack');

module.exports = {
  entry: './source/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: resolve(__dirname, '..', 'tsconfig.json'),
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(mp3)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      PRODUCTION_URL_BASE: JSON.stringify('https://tabarist.com'),
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, '..', 'ads.txt'),
          to: resolve(__dirname, '..', 'dist'),
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
};
