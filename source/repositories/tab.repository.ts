import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  QueryFieldFilterConstraint,
  startAfter,
  where,
} from 'firebase/firestore';
import { getTitleWords } from '../common';
import { pageSize } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { tabOperations } from '../operations';
import { DiminishedTab, Tab, TabPageResponse, TabQueryParameters } from '../types';

const tabsCollection = 'tabs';

const getTabPath = (tabId: string) => {
  return [tabsCollection, tabId];
};

const getTabsQuery = (
  whereClauses: QueryFieldFilterConstraint[] = [],
  order: OrderByDirection,
  documentsNumber: number,
  titleFilter = '',
  anchorDocument?: TabQueryParameters['anchorDocument'],
) => {
  return query(
    collection(getFirebaseContext().firestore, tabsCollection),
    orderBy('title', order),
    orderBy('id', order),
    ...(titleFilter ? [where('titleWords', 'array-contains-any', getTitleWords(titleFilter))] : []),
    ...whereClauses,
    ...(anchorDocument ? [startAfter(anchorDocument.title, anchorDocument.id)] : []),
    limit(documentsNumber),
  );
};

const getFirestoreTabs = async (
  params?: TabQueryParameters,
  whereClauses: QueryFieldFilterConstraint[] = [],
): Promise<TabPageResponse> => {
  const order = params?.anchorDocument?.direction === 'previous' ? 'desc' : 'asc';

  const queryData = getTabsQuery(
    whereClauses,
    order,
    pageSize,
    params?.titleFilter,
    params?.anchorDocument,
  );

  const querySnapshot = await getDocs(queryData);
  const tabs = querySnapshot.docs.map((snapshot) =>
    tabOperations.augmentTab(snapshot.data() as DiminishedTab),
  );
  const sortedTabs = order === 'desc' ? tabs.reverse() : tabs;

  let hasNextPage = false;
  let hasPreviousPage = false;

  if (sortedTabs.length > 0) {
    const firstTab = sortedTabs[0];
    const previousPage = await getDocs(
      getTabsQuery(whereClauses, 'desc', 1, params?.titleFilter, {
        direction: 'previous',
        id: firstTab.id,
        title: firstTab.title,
      }),
    );
    hasPreviousPage = previousPage.docs.length > 0;

    const lastTab = sortedTabs[sortedTabs.length - 1];
    const nextPage = await getDocs(
      getTabsQuery(whereClauses, 'asc', 1, params?.titleFilter, {
        direction: 'next',
        id: lastTab.id,
        title: lastTab.title,
      }),
    );
    hasNextPage = nextPage.docs.length > 0;
  }

  return {
    hasNextPage,
    hasPreviousPage,
    tabs: sortedTabs,
  };
};

export const tabRepository = {
  getById: async (tabId: string) => {
    const diminishedTab = (await getDocument(getTabPath(tabId))) as DiminishedTab;
    return diminishedTab ? tabOperations.augmentTab(diminishedTab) : undefined;
  },
  getPublicTabs: (params?: TabQueryParameters) => {
    return getFirestoreTabs(params);
  },
  getUserTabs: (userId: User['uid'], params?: TabQueryParameters) => {
    return getFirestoreTabs(params, [where('ownerId', '==', userId)]);
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...tabOperations.diminishTab(tab), ownerId };
    return setDocument(['tabs', tab.id], ownedTab);
  },
};
