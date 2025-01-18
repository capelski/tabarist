const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

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
  output: {
    path: resolve(__dirname, '..', 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './source/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
};
