import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryFieldFilterConstraint,
  startAfter,
  where,
} from 'firebase/firestore';
import { getTitleWords } from '../common';
import { pageSize } from '../constants';
import { getFirebaseDb, User } from '../firebase';
import { deleteDocument, getDocument, setDocument } from '../firestore';
import { augmentTab, diminishTab } from '../operations';
import { Tab } from '../types';
import { DiminishedTab } from '../types/diminished-tab.type';
import { TabQueryParameters, TabRepository } from './tab.repository-interface';

const tabsPath = 'tabs';

const getTabPath = (tabId: string) => {
  return [tabsPath, tabId];
};

const getFirestoreTabs = async (
  params?: TabQueryParameters,
  whereClauses: QueryFieldFilterConstraint[] = [],
) => {
  const queryData = query(
    collection(getFirebaseDb(), tabsPath),
    orderBy('title'),
    orderBy('id'),
    ...(params?.titleFilter
      ? [where('titleWords', 'array-contains-any', getTitleWords(params.titleFilter))]
      : []),
    ...whereClauses,
    ...(params?.lastDocument
      ? [startAfter(params.lastDocument.title, params.lastDocument.id)]
      : []),
    limit(pageSize + 1),
  );

  const querySnapshot = await getDocs(queryData);
  const tabs = querySnapshot.docs.map((snapshot) => augmentTab(snapshot.data() as DiminishedTab));
  const tabsPage = tabs.slice(0, pageSize);

  return {
    isLastPage: tabs.length <= pageSize,
    tabs: tabsPage,
  };
};

export const tabFirestoreRepository: TabRepository = {
  getById: async (tabId: string) => {
    const diminishedTab = (await getDocument(getTabPath(tabId))) as DiminishedTab;
    return augmentTab(diminishedTab);
  },
  getPublicTabs: (params) => {
    return getFirestoreTabs(params);
  },
  getUserTabs: (userId, params) => {
    return getFirestoreTabs(params, [where('ownerId', '==', userId)]);
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...diminishTab(tab), ownerId };
    return setDocument(['tabs', tab.id], ownedTab);
  },
};
