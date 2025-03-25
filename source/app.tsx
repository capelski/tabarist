import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { bodyMargin, RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { Tab } from './types';
import { HomeView, MyTabsView, NavBar, TabView } from './views';

export type AppProps = {
  tab?: Tab;
};

export const App: React.FC<AppProps> = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(setUser, (error) => {
      console.log(error);
      toast('Could not reach the user account', { type: 'error' });
    });
  }, []);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        padding: bodyMargin,
      }}
    >
      <ToastContainer position="bottom-center" />
      <NavBar user={user} />
      <div ref={scrollViewRef} style={{ flexGrow: 1, overflow: 'auto', position: 'relative' }}>
        <Routes>
          <Route path={RouteNames.home} element={<HomeView user={user} />} />

          <Route path={RouteNames.myTabs} element={<MyTabsView user={user} />} />

          <Route
            path={RouteNames.tabDetails}
            element={<TabView scrollView={scrollViewRef} tab={props.tab} user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
};
