import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryFieldFilterConstraint,
  startAt,
  where,
} from 'firebase/firestore';
import { fetchPagedData, parseTitle } from '../common';
import { pageSize, tabsCollection } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { tabOperations } from '../operations';
import { DiminishedTab, PagedResponse, Tab, TabListParameters } from '../types';

const getTabPath = (tabId: string) => {
  return [tabsCollection, tabId];
};

const getTabs = async (
  params?: TabListParameters,
  whereClauses: QueryFieldFilterConstraint[] = [],
): Promise<PagedResponse<Tab>> => {
  const fetcher = async (_pageSize: number) => {
    const queryData = query(
      collection(getFirebaseContext().firestore, tabsCollection),
      orderBy('title', params?.cursor?.direction),
      orderBy('id', params?.cursor?.direction),
      ...(params?.titleFilter
        ? [where('titleWords', 'array-contains', parseTitle(params.titleFilter))]
        : []),
      ...whereClauses,
      ...(params?.cursor ? [startAt(...params?.cursor.fields)] : []),
      limit(_pageSize),
    );

    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) =>
      tabOperations.augmentTab(snapshot.data() as DiminishedTab),
    );
  };

  const response = await fetchPagedData(
    pageSize,
    params?.cursor?.direction,
    fetcher,
    (document) => [document.title, document.id],
  );

  return response;
};

export const tabRepository = {
  getById: async (tabId: string) => {
    const diminishedTab = (await getDocument(getTabPath(tabId))) as DiminishedTab;
    return diminishedTab ? tabOperations.augmentTab(diminishedTab) : undefined;
  },
  getPublicTabs: (params?: TabListParameters) => {
    return getTabs(params);
  },
  getUserTabs: (userId: User['uid'], params?: TabListParameters) => {
    return getTabs(params, [where('ownerId', '==', userId)]);
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...tabOperations.diminishTab(tab), ownerId };
    return setDocument([tabsCollection, tab.id], ownedTab);
  },
};
