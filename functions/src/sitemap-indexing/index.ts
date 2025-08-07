import { onDocumentDeleted } from 'firebase-functions/firestore';
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

/** Trigger that adds the ID of each deleted tab to the sitemapDeletions collection */
export const tabDeleted = onDocumentDeleted(
  { region: functionsRegion, document: 'tabs/{tabId}' },
  async (event) => {
    if (event.data) {
      await tabDeletedCore(event.data.id);
    }
  },
);

export * from './local';
