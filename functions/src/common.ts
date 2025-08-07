import admin from 'firebase-admin';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { adSenseId } from './secrets.json';
import { AppProps, SsrApp, SsrAppProps, getHtml } from './ssr/ssr';

export const firebaseApp = admin.initializeApp();
export const firestore = firebaseApp.firestore();
export const storage = firebaseApp.storage();

export const readBucketFile = async (filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const fileStream = storage.bucket('tabarist').file(filename).createReadStream();

    fileStream
      .on('data', (d) => {
        buffer += d;
      })
      .on('end', () => {
        resolve(buffer);
      })
      .on('error', (e) => {
        reject(e);
      });
  });
};

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

export const writeBucketFile = async (filename: string, content: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const fileStream = storage.bucket('tabarist').file(filename).createWriteStream();

    fileStream
      .on('finish', () => {
        resolve(undefined);
      })
      .on('error', (e) => {
        reject(e);
      });

    fileStream.write(content);

    fileStream.end();
  });
};
