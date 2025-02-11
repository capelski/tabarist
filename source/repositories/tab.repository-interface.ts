import { User } from '../firebase';
import { Tab } from '../types';

export type TabQueryParameters = {
  /** FireStore doesn't support skipping records. Use the title and id of the
   * last record in the previous page to retrieve the documents of the following page.
   * We need both title and id, as there can be multiple tabs with the same title */
  lastDocument?: {
    id: string;
    title: string;
  };
  titleFilter?: string;
};

export type TabPageResponse = {
  isLastPage: boolean;
  tabs: Tab[];
};

export type TabRepository = {
  getById(tabId: string): Promise<Tab | undefined>;
  getPublicTabs(params?: TabQueryParameters): Promise<TabPageResponse>;
  getUserTabs(userId: User['uid'], params?: TabQueryParameters): Promise<TabPageResponse>;
  remove(tabId: string): Promise<void>;
  set(tab: Tab, ownerId: User['uid']): Promise<void>;
};
