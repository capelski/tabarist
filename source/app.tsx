import React, { useEffect, useRef, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { RouteNames } from './constants';
import { getFirebaseAuth, User } from './firebase';
import { HomeView, MyTabsView, NavBar, TabView } from './views';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const scrollViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFirebaseAuth().onAuthStateChanged(setUser, (error) => {
      console.log(error);
      toast('Could not reach the user account', { type: 'error' });
    });
  }, []);

  return (
    <HashRouter>
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
    </HashRouter>
  );
};
