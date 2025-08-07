import { firestore } from '../common';
import {
  fetchPagedData,
  PagedQueryCursor,
  PagedResponse,
  sitemapDeletionsCollection,
} from '../ssr/ssr';

export const getDeletedTabIds_page = async (
  cursor?: PagedQueryCursor['fields'],
): Promise<PagedResponse<string>> => {
  const fetcher = async (_pageSize: number) => {
    const collectionRef = firestore.collection(sitemapDeletionsCollection);
    const query = cursor ? collectionRef.startAt(...cursor) : collectionRef;
    const querySnapshot = await query.limit(_pageSize).get();
    return querySnapshot.docs.map((doc) => doc.id);
  };

  const response = await fetchPagedData(100, undefined, fetcher, (documentId) => [documentId]);

  return response;
};

export const getDeletedTabIds = async () => {
  let deletedTabsResponse: PagedResponse<string> | undefined;
  const deletedTabIds: string[] = [];

  while (!deletedTabsResponse || deletedTabsResponse.nextFields) {
    deletedTabsResponse = await getDeletedTabIds_page(deletedTabsResponse?.nextFields);

    for (const tabId of deletedTabsResponse.documents) {
      deletedTabIds.push(tabId);
    }
  }

  return deletedTabIds;
};
