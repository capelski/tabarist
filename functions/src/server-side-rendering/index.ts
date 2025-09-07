import express from 'express';
import { onRequest } from 'firebase-functions/https';
import { renderHtml } from '../common';
import { assetsPath, functionsRegion, RouteNames } from '../ssr/ssr';
import { allTabsHandler } from './all-tabs';
import { sitemapHandler } from './sitemap';
import { tabDetailsHandler } from './tab-details';

export const expressApp = express();

expressApp.get(/^\/sitemap.xml$/, sitemapHandler);

expressApp.get(RouteNames.allTabs, allTabsHandler);

expressApp.get(RouteNames.tabDetails, tabDetailsHandler);

expressApp.use((req, res, next) => {
  if (req.url.indexOf(assetsPath) !== -1) {
    // Static assets will be served by Firebase hosting
    next();
  } else {
    res.send(renderHtml(req.originalUrl));
  }
});

export const serverSideRendering = onRequest({ region: functionsRegion }, expressApp);
