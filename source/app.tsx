import React, { useEffect, useReducer, useRef } from 'react';
import { Route, Routes, useBeforeUnload, useNavigate, useSearchParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { ActionType } from './action-type';
import { appReducer } from './app-reducer';
import { getInitialState } from './app-state';
import { NavBar, SignInModal } from './components';
import { TabDiscardModal } from './components/tab/tab-discard-modal';
import { QueryParameters, RouteNames } from './constants';
import { DispatchProvider } from './dispatch-provider';
import { getFirebaseContext } from './firebase-context';
import { tabRepository } from './repositories';
import { Tab } from './types';
import { HomeView, MyTabsView, TabView } from './views';

export type AppProps = {
  tab?: Tab;
};

export const App: React.FC<AppProps> = (props) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState(props));

  const [searchParams, setSearchParams] = useSearchParams();
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(
      (user) => {
        dispatch({ type: ActionType.authStateChanged, payload: user });
      },
      (error) => {
        console.log(error);
        toast('Could not reach the user account', { type: 'error' });
      },
    );
  }, []);

  useEffect(() => {
    if (state.navigateTo) {
      navigate(state.navigateTo);
      dispatch({ type: ActionType.clearNavigation });
    }
  }, [state.navigateTo]);

  useBeforeUnload((event) => {
    if (state.tab.isDirty) {
      event.preventDefault();
    }
  });

  const clearSearchParams = (parameter: QueryParameters) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(parameter);
    setSearchParams(nextSearchParams);
  };

  const discardEditChanges = () => {
    dispatch({ type: ActionType.discardChangesConfirm });
    clearSearchParams(QueryParameters.editMode);
  };

  const saveEditChanges = async () => {
    if (!state.tab.document || !state.user) {
      return;
    }

    await tabRepository.set(state.tab.document, state.user.uid);

    dispatch({ type: ActionType.setTab, payload: { document: state.tab.document } });

    clearSearchParams(QueryParameters.editMode);
  };

  return (
    <DispatchProvider.Provider value={dispatch}>
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        {state.signInDialog && (
          <SignInModal>
            {state.signInDialog.message && <p>{state.signInDialog.message}</p>}
          </SignInModal>
        )}

        {state.tab.discardChangesModal && (
          <TabDiscardModal discardEditChanges={discardEditChanges} />
        )}

        <ToastContainer position="bottom-center" />

        <NavBar isCurrentTabDirty={!!state.tab.isDirty} user={state.user} />

        <div
          ref={scrollViewRef}
          style={{ flexGrow: 1, overflow: 'auto', padding: '8px 8px 0 8px', position: 'relative' }}
        >
          <Routes>
            <Route path={RouteNames.home} element={<HomeView user={state.user} />} />

            <Route path={RouteNames.myTabs} element={<MyTabsView user={state.user} />} />

            <Route
              path={RouteNames.tabDetails}
              element={
                <TabView
                  isDraft={state.tab.isDraft}
                  isEditMode={!!state.tab.isEditMode}
                  saveEditChanges={saveEditChanges}
                  scrollView={scrollViewRef}
                  tab={state.tab.document}
                  user={state.user}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </DispatchProvider.Provider>
  );
};
