import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { NavBar, SignInModal } from './components';
import { RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { getTabRelativeUrl, tabOperations } from './operations';
import { tabRepository } from './repositories';
import { Tab } from './types';
import { HomeView, MyTabsView, TabView } from './views';

export type AppProps = {
  tab?: Tab;
};

export const App: React.FC<AppProps> = (props) => {
  const [signingIn, setSigningIn] = useState(false);
  const [signingInMessage, setSigningInMessage] = useState<string>();
  const [user, setUser] = useState<User | null>(null);

  const scrollViewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(setUser, (error) => {
      console.log(error);
      toast('Could not reach the user account', { type: 'error' });
    });
  }, []);

  const createTab = async () => {
    if (!user) {
      setSigningInMessage('Sign in to start creating tabs');
      startSignIn();
      return;
    }

    const tab = tabOperations.create(user.uid);
    await tabRepository.set(tab, user.uid);

    navigate(getTabRelativeUrl(tab.id, true));
  };

  const finishSignIn = () => {
    setSigningIn(false);
    setSigningInMessage(undefined);
  };

  const startSignIn = () => {
    setSigningIn(true);
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
      <ToastContainer position="bottom-center" />
      <NavBar createTab={createTab} startSignIn={startSignIn} user={user} />
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
            element={<TabView scrollView={scrollViewRef} tab={props.tab} user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
};
