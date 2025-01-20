import { User } from '../firebase';
import { Tab } from '../types';

export type TabRepository = {
  getById(tabId: string): Promise<Tab | undefined>;
  getPublicTabs(titleFilter?: string): Promise<Tab[]>;
  getUserTabs(userId: User['uid'], titleFilter?: string): Promise<Tab[]>;
  remove(tabId: string): Promise<void>;
  set(tab: Tab, ownerId: User['uid']): Promise<void>;
};
