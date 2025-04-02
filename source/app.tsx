import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Route, Routes, useBeforeUnload, useNavigate, useSearchParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { ActionType } from './action-type';
import { appReducer } from './app-reducer';
import { getInitialState } from './app-state';
import { NavBar, SignInModal } from './components';
import { TabDiscardModal } from './components/tab/tab-discard-modal';
import { QueryParameters, RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { getTabRelativeUrl, tabOperations } from './operations';
import { tabRepository } from './repositories';
import { Tab } from './types';
import { HomeView, MyTabsView, TabView } from './views';

export type AppProps = {
  tab?: Tab;
};

export const App: React.FC<AppProps> = (props) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState(props));

  const [currentTabExists, setCurrentTabExists] = useState(!!props.tab);
  const [currentTabOriginal, setCurrentTabOriginal] = useState('');
  const [currentTabDiscarding, setCurrentTabDiscarding] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isEditMode = !!currentTabOriginal;
  const isCurrentTabDirty =
    !!state.tab && !!currentTabOriginal && currentTabOriginal !== JSON.stringify(state.tab);

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

  useBeforeUnload((event) => {
    if (isCurrentTabDirty) {
      event.preventDefault();
    }
  });

  const clearSearchParams = (parameter: QueryParameters) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(parameter);
    setSearchParams(nextSearchParams);
  };

  const createTab = () => {
    if (!state.user) {
      startSignIn('Sign in to start creating tabs');
      return;
    }

    if (isCurrentTabDirty) {
      promptDiscardChanges();
      return;
    }

    const tab = tabOperations.create(state.user.uid);
    updateTab(tab, { setExists: false, setOriginal: true });

    navigate(getTabRelativeUrl(tab.id, true));
  };

  const discardEditChanges = () => {
    dispatch({ type: ActionType.updateTab, payload: JSON.parse(currentTabOriginal) });
    setCurrentTabOriginal('');
    setCurrentTabDiscarding(false);

    clearSearchParams(QueryParameters.editMode);
  };

  const finishSignIn = () => {
    dispatch({ type: ActionType.signInFinish });
  };

  const keepEditChanges = () => {
    setCurrentTabDiscarding(false);
  };

  const promptDiscardChanges = () => {
    if (isCurrentTabDirty) {
      setCurrentTabDiscarding(true);
    } else {
      discardEditChanges();
    }
  };

  const saveEditChanges = async () => {
    if (!state.tab.document || !state.user) {
      return;
    }

    await tabRepository.set(state.tab.document, state.user.uid);

    setCurrentTabExists(true);
    setCurrentTabOriginal('');
    clearSearchParams(QueryParameters.editMode);
  };

  const startSignIn = (message?: string) => {
    dispatch({ type: ActionType.signInStart, payload: message });
  };

  const updateTab = (
    nextTab: Tab,
    options: { setExists?: boolean; setOriginal?: boolean } = {},
  ) => {
    dispatch({ type: ActionType.updateTab, payload: nextTab });

    if (options.setExists !== undefined) {
      setCurrentTabExists(options.setExists);
    }

    if (options.setOriginal) {
      setCurrentTabOriginal(JSON.stringify(nextTab));
    }
  };

  return (
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
        <SignInModal finishSignIn={finishSignIn}>
          {state.signInDialog.message && <p>{state.signInDialog.message}</p>}
        </SignInModal>
      )}

      {currentTabDiscarding && (
        <TabDiscardModal
          discardEditChanges={discardEditChanges}
          keepEditChanges={keepEditChanges}
        />
      )}

      <ToastContainer position="bottom-center" />
      <NavBar
        createTab={createTab}
        isCurrentTabDirty={isCurrentTabDirty}
        promptDiscardChanges={promptDiscardChanges}
        startSignIn={startSignIn}
        user={state.user}
      />
      <div
        ref={scrollViewRef}
        style={{ flexGrow: 1, overflow: 'auto', padding: '8px 8px 0 8px', position: 'relative' }}
      >
        <Routes>
          <Route
            path={RouteNames.home}
            element={<HomeView createTab={createTab} user={state.user} />}
          />

          <Route
            path={RouteNames.myTabs}
            element={<MyTabsView createTab={createTab} user={state.user} />}
          />

          <Route
            path={RouteNames.tabDetails}
            element={
              <TabView
                existsInServer={currentTabExists}
                isEditMode={isEditMode}
                promptDiscardChanges={promptDiscardChanges}
                saveEditChanges={saveEditChanges}
                scrollView={scrollViewRef}
                tab={state.tab.document}
                updateTab={updateTab}
                user={state.user}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};
