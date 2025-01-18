import { localStorageKey_tabRegistry } from '../constants';
import { TabRegistry } from '../types';

export const tabRegistryRepository = {
  get() {
    const stringifiedTabRegistry = localStorage.getItem(localStorageKey_tabRegistry);
    if (stringifiedTabRegistry) {
      try {
        return JSON.parse(stringifiedTabRegistry) as TabRegistry;
      } catch (error) {
        console.error('Error retrieving the local tabs', error);
      }
    }
    return undefined;
  },
  sort(tabRegistry: TabRegistry) {
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
  },
  update(tabRegistry: TabRegistry) {
    localStorage.setItem(localStorageKey_tabRegistry, JSON.stringify(tabRegistry));
  },
};
