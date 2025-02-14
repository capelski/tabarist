import { User } from '../firebase';
import { Tab } from '../types';

export type AnchorDirection = 'previous' | 'next';

export type TabQueryParameters = {
  /** Firestore doesn't support skipping documents. Use the title and id of the first/last
   * documents in the current page to retrieve the documents of the previous/following page.
   * We need both title and id, as there can be multiple tabs with the same title */
  anchorDocument?: {
    direction: AnchorDirection;
    id: string;
    title: string;
  };
  titleFilter?: string;
};

export type TabPageResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  tabs: Tab[];
};

export type TabRepository = {
  getById(tabId: string): Promise<Tab | undefined>;
  getPublicTabs(params?: TabQueryParameters): Promise<TabPageResponse>;
  getUserTabs(userId: User['uid'], params?: TabQueryParameters): Promise<TabPageResponse>;
  remove(tabId: string): Promise<void>;
  set(tab: Tab, ownerId: User['uid']): Promise<void>;
};
