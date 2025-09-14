const { merge } = require('webpack-merge');
const { assetsPath, getHtml } = require('../source/html');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use((req, res, next) => {
        if (req.url.indexOf(assetsPath) !== -1) {
          // Static assets will be served by webpack
          next();
        } else {
          res.send(getHtml());
        }
      });
      return middlewares;
    },
  },
});
