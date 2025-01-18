import { getTabLocalStorageKey } from '../operations';
import { Tab } from '../types';

export const tabLocalRepository = {
  getById: (tabId: string) => {
    const stringifiedTab = localStorage.getItem(getTabLocalStorageKey(tabId));
    if (stringifiedTab) {
      try {
        return JSON.parse(stringifiedTab) as Tab;
      } catch (error) {
        console.error('Error retrieving the selected tab', error);
      }
    }
    return undefined;
  },
  remove: (tabId: string) => {
    localStorage.removeItem(getTabLocalStorageKey(tabId));
  },
  set: (tab: Tab) => {
    localStorage.setItem(getTabLocalStorageKey(tab.id), JSON.stringify(tab));
  },
};
