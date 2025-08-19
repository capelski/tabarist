import { serverSideRendering } from './server-side-rendering';
import { sitemapIndexing, sitemapIndexingHttp } from './sitemap-indexing';
import { tabDeleted, tabDeletedHttp } from './tabs';

exports.serverSideRendering = serverSideRendering;
exports.sitemapIndexing = sitemapIndexing;
exports.tabDeleted = tabDeleted;

if (typeof process !== 'undefined' && process.env?.FUNCTIONS_EMULATOR) {
  ((e: any) => {
    e.sitemapIndexingHttp = sitemapIndexingHttp;
    e.tabDeletedHttp = tabDeletedHttp;
  })(exports);
}
