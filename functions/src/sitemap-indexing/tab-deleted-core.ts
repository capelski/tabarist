import { firestore } from '../common';
import { sitemapDeletionsCollection } from '../ssr/ssr';

export const tabDeletedCore = async (tabId: string) => {
  // We must set the id in the document in order to use orderBy and startAt
  await firestore.collection(sitemapDeletionsCollection).doc(tabId).set({ id: tabId });
};
