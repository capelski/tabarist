import React, { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { NavBar } from './components';
import { RouteNames } from './constants';
import { getFirebaseAuth, User } from './firebase';
import { HomeView, MyTabsView, TabView } from './views';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (WEBPACK_USE_FIREBASE) {
      getFirebaseAuth().onAuthStateChanged(setUser, (error) => {
        console.log(error);
        toast(error.message, { type: 'error' });
      });
    } else {
      // For demonstration purposes, pretend there's a signed in user when not using Firebase
      setUser({ uid: 'non-applicable' } as User);
    }
  }, []);

  return (
    <HashRouter>
      <ToastContainer position="bottom-center" />
      <NavBar user={user} />
      <Routes>
        <Route path={RouteNames.home} element={<HomeView />} />

        <Route path={RouteNames.myTabs} element={<MyTabsView user={user} />} />

        <Route path={RouteNames.tabDetails} element={<TabView user={user} />} />
      </Routes>
    </HashRouter>
  );
};
