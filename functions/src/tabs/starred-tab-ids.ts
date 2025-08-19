import { serverDataFetcher } from '../server-data-fetcher';
import { PagedQueryCursor, PagedResponse, StarredTab, starredTabsCollection } from '../ssr/ssr';

const getStarredTabIds_page = async (
  tabId: string,
  cursor?: PagedQueryCursor<StarredTab>,
): Promise<PagedResponse<StarredTab, string>> => {
  const page = await serverDataFetcher<StarredTab>([starredTabsCollection], ['id'], {
    cursor,
    where: [['tabId', '==', tabId]],
  });

  return {
    ...page,
    documents: page.documents.map((document) => document.id),
  };
};

export const getStarredTabIds = async (tabId: string) => {
  let starredTabs: PagedResponse<StarredTab, string> | undefined;
  const starredTabIds: string[] = [];

  while (!starredTabs || starredTabs.nextCursor) {
    starredTabs = await getStarredTabIds_page(tabId, starredTabs?.nextCursor);

    for (const tabId of starredTabs.documents) {
      starredTabIds.push(tabId);
    }
  }

  return starredTabIds;
};
