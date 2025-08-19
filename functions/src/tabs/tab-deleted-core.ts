import { logger } from 'firebase-functions';
import { firestore } from '../common';
import { sitemapDeletionsCollection, starredTabsCollection } from '../ssr/ssr';
import { getStarredTabIds } from './starred-tab-ids';

export const tabDeletedCore = async (tabId: string, executeDeletions = true) => {
  // Add the ID of each deleted tab to the sitemapDeletions collection.
  // We must set the id in the document in order to use orderBy and startAt on that field
  if (executeDeletions) {
    await firestore.collection(sitemapDeletionsCollection).doc(tabId).set({ id: tabId });
  }
  logger.info('Sitemap deletion recorded successfully');

  // Remove all the starredTabs for the removed tab
  const starredTabIds = await getStarredTabIds(tabId);
  for (const starredTabId of starredTabIds) {
    logger.info(`Removing starred tab "${starredTabId}"...`);
    if (executeDeletions) {
      await firestore.collection(starredTabsCollection).doc(starredTabId).delete();
    }
  }

  logger.info(`${starredTabIds.length} starred tabs removed`);
};
