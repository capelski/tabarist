import React, { useReducer, useRef } from 'react';
import { Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import {
  BlockingLoader,
  NavBar,
  SignInModal,
  TabDeletionModal,
  TabDiscardModal,
  UpgradeModal,
} from './components';
import { RouteNames } from './constants';
import { useSideEffects } from './side-effects';
import { appReducer, getInitialState, ListState, StateProvider } from './state';
import { Tab, TabListParameters } from './types';
import { AllTabsView, HomeView, MyTabsView, NotFound, StarredTabsView, TabView } from './views';

export type AppProps = {
  allTabsState?: ListState<Tab, TabListParameters>;
  tab?: Tab;
};

export const App: React.FC<AppProps> = (props) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState(props));

  const scrollViewRef = useRef<HTMLDivElement>(null);
  useSideEffects(state, dispatch);

  return (
    <StateProvider.Provider value={{ dispatch, state }}>
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {state.loading && <BlockingLoader />}

        {state.deleteTabModal && <TabDeletionModal tab={state.deleteTabModal.document} />}

        {state.tab.discardChangesModal && <TabDiscardModal />}

        {state.signInModal && (
          <SignInModal>
            {state.signInModal.message && <p>{state.signInModal.message}</p>}
          </SignInModal>
        )}

        {state.upgradeModal && (
          <UpgradeModal user={state.user.document}>
            {state.upgradeModal.message && <p>{state.upgradeModal.message}</p>}
          </UpgradeModal>
        )}

        <ToastContainer position="bottom-center" />

        <NavBar
          isTabDirty={!!state.tab.isDirty}
          loading={state.loading}
          subscription={state.user.stripeSubscription}
          user={state.user.document}
        />

        <div ref={scrollViewRef} style={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
          <Routes>
            <Route path={RouteNames.allTabs} element={<AllTabsView />} />

            <Route path={RouteNames.home} element={<HomeView />} />

            <Route path={RouteNames.myTabs} element={<MyTabsView />} />

            <Route path={RouteNames.starredTabs} element={<StarredTabsView />} />

            <Route path={RouteNames.tabDetails} element={<TabView scrollView={scrollViewRef} />} />

            <Route path="/*" Component={NotFound} />
          </Routes>
        </div>
      </div>
    </StateProvider.Provider>
  );
};
