import express from 'express';
import admin from 'firebase-admin';
import { error } from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { adSenseId } from './secrets.json';
import {
  AnchorDirection,
  AppProps,
  DiminishedTab,
  getHtml,
  pageSize,
  parseTitle,
  QueryParameters,
  RouteNames,
  routes,
  SsrApp,
  SsrAppProps,
  TabListParameters,
  tabOperations,
} from './ssr/ssr';

const expressApp = express();

const firebaseApp = admin.initializeApp();
const firestore = firebaseApp.firestore();

const getDiminishedTab = async (tabId: string) => {
  const docSnap = await firestore.collection('tabs').doc(tabId).get();
  return docSnap.exists ? (docSnap.data() as DiminishedTab) : undefined;
};

const getHomeTabs = async (params: TabListParameters) => {
  let query = firestore.collection('tabs').orderBy('title').orderBy('id');
  if (params.titleFilter) {
    query = query.where('titleWords', 'array-contains', parseTitle(params.titleFilter));
  }
  if (params.anchorDocument) {
    query = query.startAfter(params.anchorDocument.title, params.anchorDocument.id);
  }
  const tabs = await query.limit(pageSize).get();
  return tabs.docs.map((docSnapshot) => {
    const diminishedTab = docSnapshot.data() as DiminishedTab;
    return tabOperations.augmentTab(diminishedTab);
  });
};

expressApp.get(routes, async (req, res) => {
  const { tabId } = req.params;
  const initialState: AppProps = {};

  if (req.path === RouteNames.home) {
    try {
      const params: TabListParameters = {};

      if (req.query?.[QueryParameters.title]) {
        params.titleFilter = req.query.title as string;
      }

      if (
        req.query?.[QueryParameters.anchorDirection] &&
        req.query?.[QueryParameters.anchorId] &&
        req.query?.[QueryParameters.anchorTitle]
      ) {
        params.anchorDocument = {
          direction: req.query?.[QueryParameters.anchorDirection] as AnchorDirection,
          id: req.query?.[QueryParameters.anchorId] as string,
          title: req.query?.[QueryParameters.anchorTitle] as string,
        };
      }

      initialState.homeState = {
        data: {
          hasNextPage: true,
          hasPreviousPage: false,
          documents: await getHomeTabs(params),
        },
        params,
      };
    } catch (e) {
      error('Error fetching the tab', e);
    }
  } else if (tabId) {
    try {
      const diminishedTab = await getDiminishedTab(tabId);
      if (diminishedTab) {
        initialState.tab = tabOperations.augmentTab(diminishedTab);
      }
    } catch (e) {
      error('Error fetching the tab', e);
    }
  }

  const ssrAppProps: SsrAppProps = {
    ...initialState,
    location: req.originalUrl,
  };
  const appHtml = renderToString(createElement(SsrApp, ssrAppProps));

  const helmet = Helmet.renderStatic();
  const headTags = helmet.title.toString() + helmet.meta.toString();

  const indexHtml = getHtml({ adSenseId, appHtml, headTags, initialState });

  res.send(indexHtml);
});

exports.app = onRequest({ region: 'europe-west3' }, expressApp);
