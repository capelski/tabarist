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
    ],
  },
  plugins: [
    new DefinePlugin({
      PRODUCTION_URL_BASE: JSON.stringify('https://tabarist.com'),
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
};
