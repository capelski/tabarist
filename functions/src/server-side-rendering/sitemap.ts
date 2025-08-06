import { RequestHandler } from 'express';
import { readBucketFile } from '../common';

export const sitemapHandler: RequestHandler = async (_req, res) => {
  const fileContents = await readBucketFile('sitemap.xml');
  res.send(fileContents);
};
