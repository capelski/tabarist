import express from 'express';
import admin from 'firebase-admin';
import { error } from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { adSenseId } from './secrets.json';
import {
  AppProps,
  DiminishedTab,
  fetchPagedData,
  getHtml,
  PagedResponse,
  pageSize,
  parseTitle,
  QueryParameters,
  RouteNames,
  routes,
  SsrApp,
  SsrAppProps,
  Tab,
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

const getHomeTabs = async (params: TabListParameters): Promise<PagedResponse<Tab>> => {
  const fetcher = async (_pageSize: number) => {
    let query = firestore
      .collection('tabs')
      .orderBy('title', params?.cursor?.direction)
      .orderBy('id', params?.cursor?.direction);

    if (params.titleFilter) {
      query = query.where('titleWords', 'array-contains', parseTitle(params.titleFilter));
    }
    if (params.cursor) {
      query = query.startAt(...params.cursor.fields);
    }

    const querySnapshot = await query.limit(_pageSize).get();
    return querySnapshot.docs.map((docSnapshot) =>
      tabOperations.augmentTab(docSnapshot.data() as DiminishedTab),
    );
  };

  const response = await fetchPagedData(
    pageSize,
    params?.cursor?.direction,
    fetcher,
    (document) => [document.title, document.id],
  );

  return response;
};

expressApp.get(routes, async (req, res) => {
  const { tabId } = req.params;
  const initialState: AppProps = {};

  if (req.path === RouteNames.home) {
    try {
      const cursorDirection = req.query?.[QueryParameters.cursorDirection];
      const cursorFields = req.query?.[QueryParameters.cursorFields];
      const title = req.query?.[QueryParameters.title];

      const params: TabListParameters = {};

      if (
        cursorDirection &&
        (cursorDirection === 'asc' || cursorDirection === 'desc') &&
        cursorFields &&
        Array.isArray(cursorFields)
      ) {
        params.cursor = {
          direction: cursorDirection,
          fields: cursorFields.filter((f) => typeof f === 'string') as string[],
        };
      }

      if (title && typeof title === 'string') {
        params.titleFilter = title;
      }

      initialState.homeState = {
        data: await getHomeTabs(params),
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
