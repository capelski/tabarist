import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { NavBar } from './components';
import { RouteNames } from './constants';
import { getFirebaseAuth, User } from './firebase';
import { tabOperations } from './operations';
import { tabFirestoreRepository, tabLocalRepository, tabRegistryRepository } from './repositories';
import { Tab, TabRegistry } from './types';
import { TabRegistryView, TabView } from './views';

export const App: React.FC = () => {
  const [tabRegistry, setTabRegistry] = useState<TabRegistry>({});
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (WEBPACK_USE_FIREBASE) {
      getFirebaseAuth().onAuthStateChanged(setUser, (error) => {
        console.log(error);
      });
    }

    const nextTabRegistry = tabRegistryRepository.get();
    if (nextTabRegistry) {
      setTabRegistry(nextTabRegistry);
    }
  }, []);

  useEffect(() => {
    if (user) {
      tabFirestoreRepository.getMany(user.uid).then((tabs) => {
        const nextTabRegistry: TabRegistry = { ...tabRegistry };

        tabs
          .filter((tab) => !tabRegistry[tab.id]?.hasUnsyncedChange)
          .forEach((tab) => {
            tabLocalRepository.set(tab);
            return (nextTabRegistry[tab.id] = {
              hasUnsyncedChange: false,
              synced: true,
              title: tab.title,
            });
          });

        updateTabRegistry(nextTabRegistry);
      });
    }
  }, [user]);

  const createTab = async () => {
    const newTab = tabOperations.create();

    tabLocalRepository.set(newTab);
    if (user) {
      await tabFirestoreRepository.set(newTab, user.uid);
    }

    const nextTabRegistry: TabRegistry = {
      ...tabRegistry,
      [newTab.id]: { hasUnsyncedChange: false, synced: !!user, title: newTab.title },
    };
    updateTabRegistry(nextTabRegistry);

    return newTab;
  };

  const getTabById = (tabId: string) => {
    return tabLocalRepository.getById(tabId);
  };

  const removeTab = async (tabId: string) => {
    tabLocalRepository.remove(tabId);
    if (user) {
      await tabFirestoreRepository.remove(tabId, user.uid);
    }

    const nextTabRegistry: TabRegistry = { ...tabRegistry };
    delete nextTabRegistry[tabId];

    updateTabRegistry(nextTabRegistry);
  };

  const updateTab = async (tab: Tab) => {
    tabLocalRepository.set(tab);
    if (user) {
      await tabFirestoreRepository.set(tab, user!.uid);
    }

    const nextTabRegistry: TabRegistry = {
      ...tabRegistry,
      [tab.id]: {
        hasUnsyncedChange: user ? false : true,
        synced: user ? true : tabRegistry[tab.id].synced,
        title: tab.title,
      },
    };
    updateTabRegistry(nextTabRegistry);

    return tab;
  };

  const updateTabRegistry = (nextTabRegistry: TabRegistry) => {
    const sortedRegistry = tabRegistryRepository.sort(nextTabRegistry);
    tabRegistryRepository.update(sortedRegistry);
    setTabRegistry(sortedRegistry);
  };

  return (
    <HashRouter>
      <NavBar user={user} />
      <Routes>
        <Route
          path={RouteNames.home}
          element={
            <TabRegistryView
              createTab={createTab}
              removeTab={removeTab}
              tabRegistry={tabRegistry}
            />
          }
        />

        <Route
          path={RouteNames.tabDetails}
          element={<TabView getTabById={getTabById} removeTab={removeTab} updateTab={updateTab} />}
        />
      </Routes>
    </HashRouter>
  );
};
