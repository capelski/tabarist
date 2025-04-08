import { User } from 'firebase/auth';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { StarredTab, Tab } from '../types';

const usersCollection = 'users';
const starredTabsCollection = 'starredTabs';

const getStarredTabPath = (userId: string, tabId: string) => {
  return [usersCollection, userId, starredTabsCollection, tabId];
};

export const userRepository = {
  getStarredTab: async (userId: User['uid'], tabId: string) => {
    return getDocument(getStarredTabPath(userId, tabId));
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
