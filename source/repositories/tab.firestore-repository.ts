import { User } from '../firebase';
import { deleteDocument, getCollectionDocuments, getDocument, setDocument } from '../firestore';
import { Tab } from '../types';

export const tabFirestoreRepository = {
  getById: (tabId: string, userId: User['uid']) => {
    return getDocument(['tabs', userId, 'private', tabId]) as Promise<Tab>;
  },
  getMany: (userId: User['uid'], limit = 10) => {
    return getCollectionDocuments(['tabs', userId, 'private'], limit) as Promise<Tab[]>;
  },
  remove: (tabId: string, userId: User['uid']) => {
    return deleteDocument(['tabs', userId, 'private', tabId]);
  },
  set: (tab: Tab, userId: User['uid']) => {
    return setDocument(['tabs', userId, 'private', tab.id], tab);
  },
};
