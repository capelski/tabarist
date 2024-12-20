import React, { useEffect, useState } from 'react';
import {
  addSymbol,
  localStorageKey_tab,
  localStorageKey_tabRegistry,
  removeSymbol,
} from '../constants';
import { createTab } from '../logic';
import { Tab, TabRegistry } from '../types';
import { TabComponent } from './tab';

export const getTabLocalStorageKey = (tabId: string) => {
  return localStorageKey_tab.replace('ID', tabId);
};

export const App: React.FC = () => {
  const [tabRegistry, setTabRegistry] = useState<TabRegistry>({});
  const [selectedTab, setSelectedTab] = useState<Tab>();

  useEffect(() => {
    const stringifiedTabRegistry = localStorage.getItem(localStorageKey_tabRegistry);
    if (stringifiedTabRegistry) {
      try {
        const nextTabRegistry = JSON.parse(stringifiedTabRegistry);
        setTabRegistry(nextTabRegistry);
      } catch (error) {
        console.error('Error retrieving the local tabs', error);
      }
    }
  }, []);

  const createNewTab = () => {
    const newTab = createTab();
    updateTab(newTab);

    const nextTabRegistry = { ...tabRegistry, [newTab.id]: newTab.title };
    updateTabRegistry(nextTabRegistry);
  };

  const openTab = (tabId: string) => {
    const stringifiedTab = localStorage.getItem(getTabLocalStorageKey(tabId));
    if (stringifiedTab) {
      try {
        const nextSelectedTab = JSON.parse(stringifiedTab);
        setSelectedTab(nextSelectedTab);
      } catch (error) {
        console.error('Error retrieving the selected tab', error);
      }
    }
  };

  const removeTab = (tabId: string) => {
    const nextTabRegistry = Object.entries(tabRegistry)
      .filter(([id]) => id !== tabId)
      .reduce<TabRegistry>((reduced, [id, title]) => ({ ...reduced, [id]: title }), {});

    updateTabRegistry(nextTabRegistry);

    if (tabId === selectedTab?.id) {
      setSelectedTab(undefined);
    }

    localStorage.removeItem(getTabLocalStorageKey(tabId));
  };

  const updateTab = (updatedTab: Tab) => {
    localStorage.setItem(getTabLocalStorageKey(updatedTab.id), JSON.stringify(updatedTab));
    setSelectedTab(updatedTab);

    const nextTabRegistry = { ...tabRegistry, [updatedTab.id]: updatedTab.title };
    updateTabRegistry(nextTabRegistry);
  };

  const updateTabRegistry = (tabRegistry: TabRegistry) => {
    setTabRegistry(tabRegistry);
    localStorage.setItem(localStorageKey_tabRegistry, JSON.stringify(tabRegistry));
  };

  return (
    <div>
      <p>
        <button onClick={createNewTab} type="button">
          {addSymbol} Create tab
        </button>
      </p>
      {Object.entries(tabRegistry).map(([id, title]) => {
        return (
          <div
            key={id}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
          >
            <span>{title}</span>
            <div>
              <button onClick={() => openTab(id)} style={{ marginRight: 8 }} type="button">
                ➡️
              </button>
              <button onClick={() => removeTab(id)} type="button">
                {removeSymbol}
              </button>
            </div>
          </div>
        );
      })}
      {selectedTab && (
        <TabComponent
          tab={selectedTab}
          updateTab={(updatedTab) => updateTab({ ...updatedTab, id: selectedTab.id })}
        />
      )}
    </div>
  );
};
