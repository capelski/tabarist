import { firestore } from '../common';
import { fetchPagedData, tabsCollection } from '../ssr/ssr';
import { PagedQueryCursor, PagedResponse } from '../ssr/types';

export const getNewTabIds_page = async (
  cursor?: PagedQueryCursor['fields'],
): Promise<PagedResponse<string>> => {
  const fetcher = async (_pageSize: number) => {
    let query = firestore
      .collection(tabsCollection)
      .orderBy('id')
      .where('created', '>', Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      .where('created', '<=', Date.now());

    if (cursor) {
      query = query.startAt(...cursor);
    }

    const querySnapshot = await query.limit(_pageSize).get();
    return querySnapshot.docs.map((doc) => doc.id);
  };

  const response = await fetchPagedData(100, undefined, fetcher, (documentId) => [documentId]);

  return response;
};

export const getNewTabIds = async () => {
  let newTabsResponse: PagedResponse<string> | undefined;
  const newTabIds: string[] = [];

  while (!newTabsResponse || newTabsResponse.nextFields) {
    newTabsResponse = await getNewTabIds_page(newTabsResponse?.nextFields);

    for (const tabId of newTabsResponse.documents) {
      newTabIds.push(tabId);
    }
  }

  return newTabIds;
};
