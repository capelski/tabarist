import { RequestHandler } from 'express';
import { error } from 'firebase-functions/logger';
import { firestore, renderHtml } from '../common';
import { AppProps, DiminishedTab, tabOperations, tabsCollection } from '../ssr/ssr';

const getDiminishedTab = async (tabId: string) => {
  const docSnap = await firestore.collection(tabsCollection).doc(tabId).get();
  return docSnap.exists ? (docSnap.data() as DiminishedTab) : undefined;
};

export const tabDetailsHandler: RequestHandler = async (req, res) => {
  const { tabId } = req.params;
  const initialState: AppProps = {};

  try {
    const diminishedTab = await getDiminishedTab(tabId);
    if (diminishedTab) {
      initialState.tab = tabOperations.augmentTab(diminishedTab);
    }
  } catch (e) {
    error('Error fetching the tab', e);
  }

  res.send(renderHtml(req.originalUrl, initialState));
};
