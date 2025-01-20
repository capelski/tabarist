import { User } from 'firebase/auth';
import { localStorageKey_tab, localStorageKey_tabRegistry } from '../constants';
import { Tab, TabRegistry } from '../types';
import { TabRepository } from './tab.repository-interface';

export const getTabLocalStorageKey = (tabId: string) => {
  return localStorageKey_tab.replace('ID', tabId);
};

const getTabById = (tabId: string) => {
  const stringifiedTab = localStorage.getItem(getTabLocalStorageKey(tabId));
  if (stringifiedTab) {
    try {
      const tab: Tab = JSON.parse(stringifiedTab);
      return tab;
    } catch (error) {
      console.error('Error retrieving the selected tab', error);
    }
  }
  return undefined;
};

let tabRegistry: TabRegistry = {};

const getTabs = (titleFilter: string): Tab[] => {
  const stringifiedTabRegistry = localStorage.getItem(localStorageKey_tabRegistry);
  if (stringifiedTabRegistry) {
    try {
      tabRegistry = JSON.parse(stringifiedTabRegistry);
      return Object.entries(tabRegistry)
        .filter(([_, { title }]) => {
          return title.toLowerCase().includes(titleFilter.toLocaleLowerCase());
        })
        .map(([id]) => getTabById(id))
        .filter(Boolean) as Tab[];
    } catch (error) {
      console.error('Error retrieving the local tabs', error);
    }
  }
  return [];
};

const sortTabRegistry = (tabRegistry: TabRegistry) => {
  return Object.entries(tabRegistry)
    .sort(([_idA, recordA], [_idB, recordB]) => {
      return recordA.title.localeCompare(recordB.title);
    })
    .reduce((reduced, [id, record]) => {
      return {
        ...reduced,
        [id]: record,
      };
    }, {});
};

const persistTabRegistry = (tabRegistry: TabRegistry) => {
  localStorage.setItem(localStorageKey_tabRegistry, JSON.stringify(sortTabRegistry(tabRegistry)));
};

export const tabLocalRepository: TabRepository = {
  getById: (tabId: string) => {
    return Promise.resolve(getTabById(tabId));
  },
  getPublicTabs: function (titleFilter = ''): Promise<Tab[]> {
    return Promise.resolve(getTabs(titleFilter));
  },
  getUserTabs: function (_userId: User['uid'], titleFilter = ''): Promise<Tab[]> {
    return Promise.resolve(getTabs(titleFilter));
  },
  remove: (tabId: string) => {
    localStorage.removeItem(getTabLocalStorageKey(tabId));

    delete tabRegistry[tabId];
    persistTabRegistry(tabRegistry);

    return Promise.resolve(undefined);
  },
  set: (tab: Tab, ownerId: User['uid']) => {
    const ownedTab = { ...tab, ownerId };
    localStorage.setItem(getTabLocalStorageKey(tab.id), JSON.stringify(ownedTab));

    tabRegistry = {
      ...tabRegistry,
      [tab.id]: {
        title: tab.title,
      },
    };
    persistTabRegistry(tabRegistry);

    return Promise.resolve(undefined);
  },
};
