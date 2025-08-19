import express from 'express';
import { logger } from 'firebase-functions';
import { onDocumentDeleted } from 'firebase-functions/firestore';
import { onRequest } from 'firebase-functions/https';
import { functionsRegion } from '../ssr/ssr';
import { tabDeletedCore } from './tab-deleted-core';

/** Trigger that propagates the deletion of each tab through the database */
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
      await tabDeletedCore(tabId, false);
      res.status(200).send('Tab deletion processed correctly');
    } catch (error) {
      logger.error('Error during tab deleted:', error);
      res.status(500).send('Error during tab deleted');
    }
  }),
);
