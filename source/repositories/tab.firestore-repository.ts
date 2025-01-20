import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb, User } from '../firebase';
import { deleteDocument, getDocument, setDocument } from '../firestore';
import { Tab } from '../types';
import { TabRepository } from './tab.repository-interface';

const tabsPath = 'tabs';

const getTabPath = (tabId: string) => {
  return [tabsPath, tabId];
};

export const tabFirestoreRepository: TabRepository = {
  getById: (tabId: string) => {
    return getDocument(getTabPath(tabId)) as Promise<Tab>;
  },
  getPublicTabs: async (titleFilter = '') => {
    const queryData = query(
      collection(getFirebaseDb(), tabsPath),
      where('title', '>=', titleFilter),
    );
    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) => snapshot.data()) as Tab[];
  },
  getUserTabs: async (userId: User['uid'], titleFilter = '') => {
    const queryData = query(
      collection(getFirebaseDb(), tabsPath),
      where('ownerId', '==', userId),
      where('title', '>=', titleFilter),
    );
    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) => snapshot.data()) as Tab[];
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...tab, ownerId };
    return setDocument(['tabs', tab.id], ownedTab);
  },
};
