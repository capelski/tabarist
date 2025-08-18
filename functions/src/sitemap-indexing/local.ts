import express from 'express';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import { functionsRegion } from '../ssr/ssr';
import { getDeletedTabIds } from './deleted-tab-ids';
import { getNewTabIds } from './new-tab-ids';
import { indexingCore } from './sitemap-indexing-core';
import { tabDeletedCore } from './tab-deleted-core';

/** HTTP endpoint for testing sitemapIndexing in local */
export const sitemapIndexingHttp = onRequest(
  { region: functionsRegion },
  express().use(async (_req, res) => {
    try {
      const newTabIds = await getNewTabIds();
      logger.log('newTabIds', newTabIds);
      const deletedTabIds = await getDeletedTabIds();
      logger.log('deletedTabIds', deletedTabIds);

      const newSitemap = await indexingCore(false);
      res.status(200).send(newSitemap || 'No changes to the sitemap.');
    } catch (error) {
      logger.error('Error during sitemap indexing:', error);
      res.status(500).send('Error during sitemap indexing');
    }
  }),
);

/** HTTP endpoint for testing tabDeleted in local */
export const tabDeletedHttp = onRequest(
  { region: functionsRegion },
  express().use(async (req, res) => {
    try {
      const tabId = req.query.tabId;
      if (typeof tabId !== 'string' || tabId === '') {
        res.status(400).send('Invalid tabId parameter');
        return;
      }
      await tabDeletedCore(tabId);
      res.status(200).send('Sitemap deletion recorded successfully');
    } catch (error) {
      logger.error('Error during tab deleted:', error);
      res.status(500).send('Error during tab deleted');
    }
  }),
);
