import express from 'express';
import admin from 'firebase-admin';
import { error } from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  AppPropsBase,
  DiminishedTab,
  getHtml,
  routes,
  SsrApp,
  SsrAppProps,
  tabOperations,
} from './ssr/ssr';

const expressApp = express();

const firebaseApp = admin.initializeApp();
const firestore = firebaseApp.firestore();

expressApp.get(routes, async (req, res) => {
  const { tabId } = req.params;
  const initialState: AppPropsBase = {};

  if (tabId) {
    try {
      const docSnap = await firestore.collection('tabs').doc(tabId).get();
      const diminishedTab: DiminishedTab | undefined = docSnap.exists
        ? (docSnap.data() as DiminishedTab)
        : undefined;
      if (diminishedTab) {
        initialState.tab = tabOperations.augmentTab(diminishedTab);
      }
    } catch (e) {
      error('Error fetching the tab', e);
    }
  }

  const ssrAppProps: SsrAppProps = {
    ...initialState,
    isServerRendered: true,
    location: req.originalUrl,
  };
  const appHtml = renderToString(createElement(SsrApp, ssrAppProps));
  const indexHtml = getHtml(appHtml, initialState);

  res.send(indexHtml);
});

exports.app = onRequest({ region: 'europe-west3' }, expressApp);
