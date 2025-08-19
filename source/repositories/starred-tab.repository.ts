import { User } from 'firebase/auth';
import { nanoid } from 'nanoid';
import { starredTabsCollection } from '../constants';
import { deleteDocument, setDocument } from '../firestore-operations';
import { StarredListParameters, StarredTab, Tab } from '../types';
import { clientDataFetcher } from './client-data-fetcher';

export const starredTabRepository = {
  create: async (userId: User['uid'], tab: Tab) => {
    const starredTab: StarredTab = {
      id: nanoid(),
      tabId: tab.id,
      title: tab.title,
      userId,
    };

    await setDocument([starredTabsCollection, starredTab.id], starredTab);

    return starredTab;
  },
  getMany: (userId: User['uid'], params?: StarredListParameters) => {
    return clientDataFetcher<StarredTab>([starredTabsCollection], ['title', 'id'], {
      cursor: params?.cursor,
      where: [['userId', '==', userId]],
    });
  },
  getOne: async (userId: User['uid'], tabId: string): Promise<StarredTab | undefined> => {
    const response = await clientDataFetcher<StarredTab>([starredTabsCollection], ['title', 'id'], {
      limit: 1,
      where: [
        ['userId', '==', userId],
        ['tabId', '==', tabId],
      ],
    });

    return response.documents[0];
  },
  remove: (starredTabId: StarredTab['id']) => {
    return deleteDocument([starredTabsCollection, starredTabId]);
  },
  update: (starredTab: StarredTab) => {
    return setDocument([starredTabsCollection, starredTab.id], starredTab);
  },
};
