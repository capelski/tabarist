import { firestore } from '../common';
import { sitemapDeletionsCollection } from '../ssr/ssr';

export const tabDeletedCore = async (tabId: string) => {
  await firestore.collection(sitemapDeletionsCollection).doc(tabId).set({});
};
