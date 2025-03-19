import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { bodyMargin, RouteNames } from './constants';
import { getFirebaseAuth, User } from './firebase';
import { Tab, TabPageResponse } from './types';
import { HomeView, MyTabsView, NavBar, TabView } from './views';

export type AppProps = {
  homeData?: TabPageResponse;
  myTabsData?: TabPageResponse;
  tabData?: Tab;
};

export const App: React.FC<AppProps> = () => {
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
          <Route path={RouteNames.home} element={<HomeView user={user} />} />

          <Route path={RouteNames.myTabs} element={<MyTabsView user={user} />} />

          <Route
            path={RouteNames.tabDetails}
            element={<TabView scrollView={scrollViewRef} user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
};
