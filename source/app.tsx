import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, useSearchParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
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
  const [currentTab, setCurrentTab] = useState(props.tab);
  const [currentTabOriginal, setCurrentTabOriginal] = useState('');
  const [currentTabDiscarding, setCurrentTabDiscarding] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [signingInMessage, setSigningInMessage] = useState<string>();
  const [user, setUser] = useState<User | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isEditMode = !!currentTabOriginal;
  const isCurrentTabDirty =
    !!currentTab && !!currentTabOriginal && currentTabOriginal !== JSON.stringify(currentTab);

  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(setUser, (error) => {
      console.log(error);
      toast('Could not reach the user account', { type: 'error' });
    });
  }, []);

  const clearSearchParams = (parameter: QueryParameters) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete(parameter);
    setSearchParams(nextSearchParams);
  };

  const createTab = async () => {
    if (!user) {
      setSigningInMessage('Sign in to start creating tabs');
      startSignIn();
      return;
    }

    if (isCurrentTabDirty) {
      promptDiscardChanges();
      return;
    }

    const tab = tabOperations.create(user.uid);
    await tabRepository.set(tab, user.uid);

    navigate(getTabRelativeUrl(tab.id, true));
  };

  const discardEditChanges = () => {
    setCurrentTab(JSON.parse(currentTabOriginal));
    setCurrentTabOriginal('');
    setCurrentTabDiscarding(false);

    clearSearchParams(QueryParameters.editMode);
  };

  const finishSignIn = () => {
    setSigningIn(false);
    setSigningInMessage(undefined);
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
    if (!currentTab || !user) {
      return;
    }

    await tabRepository.set(currentTab, user.uid);

    setCurrentTabOriginal('');
    clearSearchParams(QueryParameters.editMode);
  };

  const startSignIn = () => {
    setSigningIn(true);
  };

  const updateTab = (nextTab: Tab, updateOriginal = false) => {
    setCurrentTab(nextTab);
    if (updateOriginal) {
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
      {signingIn && (
        <SignInModal finishSignIn={finishSignIn}>
          {signingInMessage && <p>{signingInMessage}</p>}
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
        user={user}
      />
      <div
        ref={scrollViewRef}
        style={{ flexGrow: 1, overflow: 'auto', padding: '8px 8px 0 8px', position: 'relative' }}
      >
        <Routes>
          <Route path={RouteNames.home} element={<HomeView createTab={createTab} user={user} />} />

          <Route
            path={RouteNames.myTabs}
            element={<MyTabsView createTab={createTab} user={user} />}
          />

          <Route
            path={RouteNames.tabDetails}
            element={
              <TabView
                isEditMode={isEditMode}
                promptDiscardChanges={promptDiscardChanges}
                saveEditChanges={saveEditChanges}
                scrollView={scrollViewRef}
                tab={currentTab}
                updateTab={updateTab}
                user={user}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
};
