import { User } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  startAfter,
} from 'firebase/firestore';
import { pageSize } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { PageResponse, StarredListParameters, StarredTab, Tab } from '../types';

const usersCollection = 'users';
const starredTabsCollection = 'starredTabs';

const getStarredTabPath = (userId: string, tabId: string) => {
  return [usersCollection, userId, starredTabsCollection, tabId];
};

const getStarredTabsQuery = (
  userId: string,
  order: OrderByDirection,
  documentsNumber: number,
  anchorDocument?: StarredListParameters['anchorDocument'],
) => {
  return query(
    collection(getFirebaseContext().firestore, usersCollection, userId, starredTabsCollection),
    orderBy('id', order),
    ...(anchorDocument ? [startAfter(anchorDocument.id)] : []),
    limit(documentsNumber),
  );
};

const getStarredTabs = async (
  userId: string,
  params?: StarredListParameters,
): Promise<PageResponse<StarredTab>> => {
  const order = params?.anchorDocument?.direction === 'previous' ? 'desc' : 'asc';

  const queryData = getStarredTabsQuery(userId, order, pageSize, params?.anchorDocument);

  const querySnapshot = await getDocs(queryData);
  const tabs = querySnapshot.docs.map((snapshot) => snapshot.data() as StarredTab);
  const sortedTabs = order === 'desc' ? tabs.reverse() : tabs;

  let hasNextPage = false;
  let hasPreviousPage = false;

  if (sortedTabs.length > 0) {
    const firstTab = sortedTabs[0];
    const previousPage = await getDocs(
      getStarredTabsQuery(userId, 'desc', 1, {
        direction: 'previous',
        id: firstTab.id,
      }),
    );
    hasPreviousPage = previousPage.docs.length > 0;

    const lastTab = sortedTabs[sortedTabs.length - 1];
    const nextPage = await getDocs(
      getStarredTabsQuery(userId, 'asc', 1, {
        direction: 'next',
        id: lastTab.id,
      }),
    );
    hasNextPage = nextPage.docs.length > 0;
  }

  return {
    documents: sortedTabs,
    hasNextPage,
    hasPreviousPage,
  };
};

export const userRepository = {
  getStarredTabs: async (userId: User['uid'], params?: StarredListParameters) => {
    return getStarredTabs(userId, params);
  },
  getStarredTab: async (userId: User['uid'], tabId: string) => {
    return getDocument(getStarredTabPath(userId, tabId)) as Promise<StarredTab>;
  },
  removeStarredTab: async (userId: User['uid'], tabId: string) => {
    return deleteDocument(getStarredTabPath(userId, tabId));
  },
  setStarredTab: async (userId: User['uid'], tab: Tab) => {
    const starredTab: StarredTab = {
      id: tab.id,
      title: tab.title,
    };
    return setDocument(getStarredTabPath(userId, tab.id), starredTab);
  },
};
