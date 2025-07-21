import admin from 'firebase-admin';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { adSenseId } from '../secrets.json';
import { AppProps, SsrApp, SsrAppProps, getHtml } from '../ssr/ssr';

export const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();

export const renderHtml = (originalUrl: string, initialState: AppProps = {}): string => {
  const ssrAppProps: SsrAppProps = {
    ...initialState,
    location: originalUrl,
  };
  const appHtml = renderToString(createElement(SsrApp, ssrAppProps));

  const helmet = Helmet.renderStatic();
  const headTags = helmet.title.toString() + helmet.meta.toString();

  return getHtml({ adSenseId, appHtml, headTags, initialState });
};
