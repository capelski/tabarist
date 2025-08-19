import { serverDataFetcher } from '../server-data-fetcher';
import { PagedQueryCursor, PagedResponse, sitemapDeletionsCollection } from '../ssr/ssr';

type DeletedTabId = { id: string };

const getDeletedTabIds_page = async (
  cursor?: PagedQueryCursor<DeletedTabId>,
): Promise<PagedResponse<DeletedTabId, string>> => {
  const page = await serverDataFetcher<DeletedTabId>([sitemapDeletionsCollection], ['id'], {
    cursor,
  });

  return {
    ...page,
    documents: page.documents.map((document) => document.id),
  };
};

export const getDeletedTabIds = async () => {
  let deletedTabsResponse: PagedResponse<DeletedTabId, string> | undefined;
  const deletedTabIds: string[] = [];

  while (!deletedTabsResponse || deletedTabsResponse.nextCursor) {
    deletedTabsResponse = await getDeletedTabIds_page(deletedTabsResponse?.nextCursor);

    for (const tabId of deletedTabsResponse.documents) {
      deletedTabIds.push(tabId);
    }
  }

  return deletedTabIds;
};
