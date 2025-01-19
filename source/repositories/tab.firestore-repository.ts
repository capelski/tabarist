import { User } from '../firebase';
import { deleteDocument, getCollectionDocuments, getDocument, setDocument } from '../firestore';
import { Tab } from '../types';

const getUserTabsPath = (userId: User['uid']) => {
  return ['users', userId, 'tabs'];
};

const getTabPath = (userId: User['uid'], tabId: string) => {
  return [...getUserTabsPath(userId), tabId];
};

export const tabFirestoreRepository = {
  getById: (tabId: string, userId: User['uid']) => {
    return getDocument(getTabPath(userId, tabId)) as Promise<Tab>;
  },
  getMany: (userId: User['uid'], limit = 10) => {
    return getCollectionDocuments(getUserTabsPath(userId), limit) as Promise<Tab[]>;
  },
  remove: (tabId: string, userId: User['uid']) => {
    return deleteDocument(getTabPath(userId, tabId));
  },
  set: (tab: Tab, userId: User['uid']) => {
    return setDocument(getTabPath(userId, tab.id), tab);
  },
};
