const { merge } = require('webpack-merge');
const { getHtml, routes } = require('../source/html');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.get(routes, (_req, res) => {
        res.send(getHtml());
      });

      return middlewares;
    },
  },
});
