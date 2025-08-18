import { User } from 'firebase/auth';
import { starredTabsCollection, usersCollection } from '../constants';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { PagedResponse, StarredListParameters, StarredTab, Tab } from '../types';
import { clientDataFetcher } from './client-data-fetcher';

const getStarredTabPath = (userId: string, tabId: string) => {
  return [usersCollection, userId, starredTabsCollection, tabId];
};

const getStarredTabs = (
  userId: string,
  params?: StarredListParameters,
): Promise<PagedResponse<StarredTab>> => {
  return clientDataFetcher<StarredTab>([usersCollection, userId, starredTabsCollection], ['id'], {
    cursor: params?.cursor,
  });
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
