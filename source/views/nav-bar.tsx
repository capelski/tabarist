import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import React from 'react';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';
import { RouteNames } from '../constants';
import { getFirebaseContext } from '../firebase-context';

export interface NavBarProps {
  user: User | null;
}

export const NavBar: React.FC<NavBarProps> = (props) => {
  const signIn = () => {
    return signInWithPopup(getFirebaseContext().auth, new GoogleAuthProvider()).catch((error) => {
      console.log(error);
      toast('The sign in was not completed', { type: 'error', autoClose: 5000 });
    });
  };

  const signOut = () => {
    return getFirebaseContext().auth.signOut();
  };

  return (
    <div style={{ paddingBottom: 8 }}>
      <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
        Home
      </NavLink>
      <NavLink style={{ marginRight: 8 }} to={RouteNames.myTabs}>
        My tabs
      </NavLink>
      {props.user ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <button onClick={signIn}>Sign in with google</button>
      )}
    </div>
  );
};
