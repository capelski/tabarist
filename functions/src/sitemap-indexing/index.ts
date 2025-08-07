import express from 'express';
import { logger } from 'firebase-functions';
import { onDocumentDeleted } from 'firebase-functions/firestore';
import { onRequest } from 'firebase-functions/https';
import { onSchedule } from 'firebase-functions/scheduler';
import { functionsRegion } from '../ssr/ssr';
import { indexingCore } from './sitemap-indexing-core';
import { tabDeletedCore } from './tab-deleted-core';

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
      const newSitemap = await indexingCore(false);
      res.status(200).send(newSitemap || 'No changes to the sitemap.');
    } catch (error) {
      logger.error('Error during sitemap indexing:', error);
      res.status(500).send('Error during sitemap indexing');
    }
  }),
);

/** Trigger that adds the ID of each deleted tab to the sitemapDeletions collection */
export const tabDeleted = onDocumentDeleted(
  { region: functionsRegion, document: 'tabs/{tabId}' },
  async (event) => {
    if (event.data) {
      await tabDeletedCore(event.data.id);
    }
  },
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
