import React from 'react';
import { NavLink } from 'react-router';
import { RouteNames } from '../constants';
import { signInWithGoogle, signOut, User } from '../firebase';

export interface NavBarProps {
  user: User | null;
}

export const NavBar: React.FC<NavBarProps> = (props) => {
  const signIn = () => {
    return signInWithGoogle().catch((error) => {
      console.log(error);
    });
  };

  return (
    <div>
      <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
        Home page
      </NavLink>
      {WEBPACK_USE_FIREBASE &&
        (props.user ? (
          <button onClick={signOut}>Sign out</button>
        ) : (
          <button onClick={signIn}>Sign in with google</button>
        ))}
    </div>
  );
};
