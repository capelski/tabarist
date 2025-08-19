import express from 'express';
import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import { onSchedule } from 'firebase-functions/scheduler';
import { functionsRegion } from '../ssr/ssr';
import { getDeletedTabIds } from './deleted-tab-ids';
import { getNewTabIds } from './new-tab-ids';
import { indexingCore } from './sitemap-indexing-core';

/** Cron job that retrieves tabs created in the last 24 hours and adds them to the sitemap */
export const sitemapIndexing = onSchedule(
  { region: functionsRegion, schedule: 'every day 00:00' },
  async () => {
    await indexingCore();
  },
);

/** HTTP endpoint for testing sitemapIndexing in local */
export const sitemapIndexingHttp = onRequest(
  { region: functionsRegion },
  express().use(async (_req, res) => {
    try {
      const newTabIds = await getNewTabIds();
      logger.info('newTabIds', newTabIds);
      const deletedTabIds = await getDeletedTabIds();
      logger.info('deletedTabIds', deletedTabIds);

      const newSitemap = await indexingCore(false);
      res.status(200).send(newSitemap || 'No changes to the sitemap.');
    } catch (error) {
      logger.error('Error during sitemap indexing:', error);
      res.status(500).send('Error during sitemap indexing');
    }
  }),
);
