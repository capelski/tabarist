import { RequestHandler } from 'express';
import { storage } from './common';

export const sitemapHandler: RequestHandler = async (_req, res) => {
  const fileContents = await new Promise((resolve, reject) => {
    let buffer = '';
    const fileStream = storage.bucket('tabarist').file('sitemap.xml').createReadStream();

    fileStream
      .on('data', (d) => {
        buffer += d;
      })
      .on('end', () => {
        resolve(buffer);
      })
      .on('error', (e) => {
        reject(e);
      });
  });

  res.send(fileContents);
};
