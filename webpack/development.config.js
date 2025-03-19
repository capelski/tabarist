const { merge } = require('webpack-merge');
const { getHtml } = require('../source/html');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get('/', (_req, res) => {
        res.send(getHtml());
      });

      return middlewares;
    },
  },
});
