import { serverDataFetcher } from '../server-data-fetcher';
import { DiminishedTab, PagedQueryCursor, PagedResponse, tabsCollection } from '../ssr/ssr';

export const getNewTabIds_page = async (
  cursor?: PagedQueryCursor<DiminishedTab>,
): Promise<PagedResponse<DiminishedTab, string>> => {
  const now = Date.now();

  const page = await serverDataFetcher<DiminishedTab>([tabsCollection], ['id'], {
    cursor,
    where: [
      ['created', '>', now - 24 * 60 * 60 * 1000], // Last 24 hours
      ['created', '<=', now],
    ],
  });

  return {
    ...page,
    documents: page.documents.map((document) => document.id),
  };
};

export const getNewTabIds = async () => {
  let newTabsResponse: PagedResponse<DiminishedTab, string> | undefined;
  const newTabIds: string[] = [];

  while (!newTabsResponse || newTabsResponse.nextCursor) {
    newTabsResponse = await getNewTabIds_page(newTabsResponse?.nextCursor);

    for (const tabId of newTabsResponse.documents) {
      newTabIds.push(tabId);
    }
  }

  return newTabIds;
};
