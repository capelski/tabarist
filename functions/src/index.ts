import express from 'express';
// import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { AppProps } from './ssr/app';
import { SsrApp, getHtml } from './ssr/ssr';

const app = express();

app.get(/^\/$/, async (req, res) => {
  const initialState: AppProps = {};
  const appHtml = renderToString(createElement(SsrApp, { location: req.originalUrl }));
  const indexHtml = getHtml(appHtml, initialState);

  res.send(indexHtml);
});

// TODO Support all client routes
// app.get(/^\/tab\/:tabId\/?$/, async (req, res) => {
// });

exports.app = onRequest({ region: 'europe-west3' }, app);
