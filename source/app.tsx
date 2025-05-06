import React, { useReducer, useRef } from 'react';
import { Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { BlockingLoader, NavBar, SignInModal } from './components';
import { TabDiscardModal } from './components/tab/tab-discard-modal';
import { UpgradeModal } from './components/user/upgrade-modal';
import { RouteNames } from './constants';
import { useSideEffects } from './side-effects';
import { appReducer, getInitialState, ListState, StateProvider } from './state';
import { Tab, TabListParameters } from './types';
import { HomeView, MyTabsView, StarredTabsView, TabView } from './views';

export type AppProps = {
  homeState?: ListState<Tab, TabListParameters>;
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

        {state.signInModal && (
          <SignInModal>
            {state.signInModal.message && <p>{state.signInModal.message}</p>}
          </SignInModal>
        )}

        {state.tab.discardChangesModal && <TabDiscardModal />}

        {state.upgradeModal && <UpgradeModal user={state.user.document} />}

        <ToastContainer position="bottom-center" />

        <NavBar
          isCurrentTabDirty={!!state.tab.isDirty}
          loading={state.loading}
          subscription={state.user.stripeSubscription}
          user={state.user.document}
        />

        <div
          ref={scrollViewRef}
          style={{ flexGrow: 1, overflow: 'auto', padding: '8px 8px 0 8px', position: 'relative' }}
        >
          <Routes>
            <Route
              path={RouteNames.home}
              element={
                <HomeView
                  deletingTab={state.deletingTab}
                  listState={state[RouteNames.home]}
                  searchParamsReady={state.searchParamsReady}
                  user={state.user.document}
                />
              }
            />

            <Route
              path={RouteNames.myTabs}
              element={
                <MyTabsView
                  deletingTab={state.deletingTab}
                  listState={state[RouteNames.myTabs]}
                  searchParamsReady={state.searchParamsReady}
                  user={state.user.document}
                />
              }
            />

            <Route
              path={RouteNames.starredTabs}
              element={
                <StarredTabsView
                  listState={state.starredTabs}
                  searchParamsReady={state.searchParamsReady}
                  user={state.user.document}
                />
              }
            />

            <Route
              path={RouteNames.tabDetails}
              element={
                <TabView
                  activeSlot={state.tab.activeSlot}
                  copying={state.tab.copying}
                  deletingTab={state.deletingTab}
                  isDirty={state.tab.isDirty}
                  isDraft={state.tab.isDraft}
                  isStarred={state.tab.isStarred}
                  isEditMode={!!state.tab.isEditMode}
                  moving={state.tab.moving}
                  scrollView={scrollViewRef}
                  tab={state.tab.document}
                  user={state.user.document}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </StateProvider.Provider>
  );
};
