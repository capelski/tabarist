import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { localStorageKey_tabRegistry, RouteNames } from '../constants';
import { createTab, getTabLocalStorageKey } from '../logic';
import { Tab, TabRegistry } from '../types';
import { TabComponent } from './tab';
import { TabRegistryComponent } from './tab-registry';

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

    return newTab.id;
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
    <HashRouter>
      <Routes>
        <Route
          path={RouteNames.home}
          element={
            <TabRegistryComponent
              createTab={createNewTab}
              removeTab={removeTab}
              tabRegistry={tabRegistry}
              tabRegistrySetter={updateTabRegistry}
            />
          }
        />

        <Route
          path={RouteNames.tabDetails}
          element={<TabComponent removeTab={removeTab} updateTab={updateTab} />}
        />
      </Routes>
    </HashRouter>
  );
};
