import { logger } from 'firebase-functions';
import { firestore, readBucketFile, writeBucketFile } from '../common';
import { sitemapDeletionsCollection } from '../ssr/ssr';
import { getDeletedTabIds } from './deleted-tab-ids';
import { getNewTabIds } from './new-tab-ids';

export const indexingCore = async (updateBucketFile = true) => {
  const newTabIds = await getNewTabIds();
  const deletedTabIds = await getDeletedTabIds();

  if (newTabIds.length === 0 && deletedTabIds.length === 0) {
    logger.info('No tabs to add to or remove from the sitemap');
    return;
  }

  let sitemapContents = await readBucketFile('sitemap.xml');

  if (newTabIds.length === 0) {
    logger.info('No tabs to add to the sitemap');
  } else {
    logger.info(`Adding ${newTabIds.length} tabs to the sitemap...`);

    const newEntries = newTabIds
      .map(
        (tabId) =>
          `<url>\n  <loc>https://tabarist.com/tab/${tabId}</loc>\n  <priority>0.6</priority>\n</url>`,
      )
      .join('\n');

    const replacePattern = '</urlset>';
    sitemapContents = sitemapContents.replace(replacePattern, `${newEntries}\n${replacePattern}`);
  }

  if (deletedTabIds.length === 0) {
    logger.info('No tabs to delete from the sitemap');
  } else {
    logger.info(`Removing ${deletedTabIds.length} tabs from the sitemap...`);

    for (const tabId of deletedTabIds) {
      const deletePattern = new RegExp(
        `<url>\n  <loc>https://tabarist.com/tab/${tabId}</loc>\n  <priority>0.6</priority>\n</url>\n`,
      );
      sitemapContents = sitemapContents.replace(deletePattern, '');
    }
  }

  if (updateBucketFile) {
    await writeBucketFile('sitemap.xml', sitemapContents);

    // Only after updating the sitemap, remove all the IDs from the sitemapDeletions collection
    for (const tabId of deletedTabIds) {
      await firestore.collection(sitemapDeletionsCollection).doc(tabId).delete({});
    }
  }

  logger.info('Sitemap updated successfully');

  return sitemapContents;
};
