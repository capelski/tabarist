import { localStorageKey_tab } from '../constants';

export const getTabLocalStorageKey = (tabId: string) => {
  return localStorageKey_tab.replace('ID', tabId);
};
