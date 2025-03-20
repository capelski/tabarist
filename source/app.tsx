import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { bodyMargin, RouteNames } from './constants';
import { getFirebaseAuth, User } from './firebase';
import { Tab } from './types';
import { HomeView, MyTabsView, NavBar, TabView } from './views';

export type AppPropsBase = {
  tab?: Tab;
};

export type AppProps = AppPropsBase & {
  isServerRendered: boolean;
};

export const App: React.FC<AppProps> = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFirebaseAuth().onAuthStateChanged(setUser, (error) => {
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
          <Route
            path={RouteNames.home}
            element={<HomeView isServerRendered={props.isServerRendered} user={user} />}
          />

          <Route
            path={RouteNames.myTabs}
            element={<MyTabsView isServerRendered={props.isServerRendered} user={user} />}
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
