import { User } from 'firebase/auth';
import { QuerySnapshot } from 'firebase/firestore';
import { getTitleWordsClause } from '../common';
import { tabsCollection } from '../constants';
import { deleteDocument, getDocument, setDocument } from '../firestore-operations';
import { tabOperations } from '../operations';
import { DiminishedTab, PagedResponse, Tab, TabListParameters } from '../types';
import { clientDataFetcher, ClientWhereClause } from './client-data-fetcher';

const getTabPath = (tabId: string) => {
  return [tabsCollection, tabId];
};

const getTabs = async (
  params?: TabListParameters,
  additionalWhereClauses: ClientWhereClause<DiminishedTab>[] = [],
): Promise<PagedResponse<DiminishedTab, Tab>> => {
  const where = [...additionalWhereClauses];

  if (params?.titleFilter) {
    where.unshift(getTitleWordsClause<QuerySnapshot>(params.titleFilter));
  }

  const page = await clientDataFetcher<DiminishedTab>([tabsCollection], ['title', 'id'], {
    cursor: params?.cursor,
    where,
  });

  return {
    ...page,
    documents: page.documents.map((document) => tabOperations.augmentTab(document)),
  };
};

export const tabRepository = {
  getById: async (tabId: string) => {
    const diminishedTab = (await getDocument(getTabPath(tabId))) as DiminishedTab;
    return diminishedTab ? tabOperations.augmentTab(diminishedTab) : undefined;
  },
  getPublicTabs: (params?: TabListParameters) => {
    return getTabs(params);
  },
  getUserTabs: (userId: User['uid'], params?: TabListParameters) => {
    return getTabs(params, [['ownerId', '==', userId]]);
  },
  remove: (tabId: string) => {
    return deleteDocument(getTabPath(tabId));
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...tabOperations.diminishTab(tab), ownerId };
    return setDocument([tabsCollection, tab.id], ownedTab);
  },
};
