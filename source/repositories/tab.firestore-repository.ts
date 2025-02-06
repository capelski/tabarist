import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getTitleWords } from '../common';
import { getFirebaseDb, User } from '../firebase';
import { deleteDocument, getDocument, setDocument } from '../firestore';
import { augmentTab, diminishTab } from '../operations';
import { Tab } from '../types';
import { DiminishedTab } from '../types/diminished-tab.type';
import { TabRepository } from './tab.repository-interface';

const tabsPath = 'tabs';

const getTabPath = (tabId: string) => {
  return [tabsPath, tabId];
};

export const tabFirestoreRepository: TabRepository = {
  getById: async (tabId: string) => {
    const diminishedTab = (await getDocument(getTabPath(tabId))) as DiminishedTab;
    return augmentTab(diminishedTab);
  },
  getPublicTabs: async (titleFilter = '') => {
    const queryData = query(
      collection(getFirebaseDb(), tabsPath),
      orderBy('title'),
      ...(titleFilter
        ? [where('titleWords', 'array-contains-any', getTitleWords(titleFilter))]
        : []),
    );
    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) => augmentTab(snapshot.data() as DiminishedTab));
  },
  getUserTabs: async (userId: User['uid'], titleFilter = '') => {
    const queryData = query(
      collection(getFirebaseDb(), tabsPath),
      orderBy('title'),
      where('ownerId', '==', userId),
      ...(titleFilter
        ? [where('titleWords', 'array-contains-any', getTitleWords(titleFilter))]
        : []),
    );
    const querySnapshot = await getDocs(queryData);
    return querySnapshot.docs.map((snapshot) => augmentTab(snapshot.data() as DiminishedTab));
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...diminishTab(tab), ownerId };
    return setDocument(['tabs', tab.id], ownedTab);
  },
};
