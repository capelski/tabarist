import { User } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query, startAt } from 'firebase/firestore';
import { fetchPagedData } from '../common';
import { pageSize } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { PagedResponse, StarredListParameters, StarredTab, Tab } from '../types';

const usersCollection = 'users';
const starredTabsCollection = 'starredTabs';

const getStarredTabPath = (userId: string, tabId: string) => {
  return [usersCollection, userId, starredTabsCollection, tabId];
};

const getStarredTabs = async (
  userId: string,
  params?: StarredListParameters,
): Promise<PagedResponse<StarredTab>> => {
  const fetcher = async (_pageSize: number) => {
    const queryData = query(
      collection(getFirebaseContext().firestore, usersCollection, userId, starredTabsCollection),
      orderBy('id', params?.cursor?.direction),
      ...(params?.cursor ? [startAt(...params?.cursor.fields)] : []),
      limit(_pageSize),
    );

    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) => snapshot.data() as StarredTab);
  };

  const response = await fetchPagedData(
    pageSize,
    params?.cursor?.direction,
    fetcher,
    (document) => [document.id],
  );

  return response;
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
