import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';
import { RouteNames } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { customerRepository } from '../repositories';

export interface NavBarProps {
  user: User | null;
}

export const NavBar: React.FC<NavBarProps> = (props) => {
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<any>();

  const manageSubscription = async () => {
    setLoadingUpgrade(true);

    try {
      const url = await customerRepository.getPortalLink();
      window.location.assign(url);
    } catch (error) {
      setLoadingUpgrade(false);

      console.error(error);
      toast(`There was an error with the payment platform`, {
        type: 'error',
        autoClose: 5000,
      });
    }
  };

  const signIn = () => {
    return signInWithPopup(getFirebaseContext().auth, new GoogleAuthProvider()).catch((error) => {
      console.log(error);
      toast('The sign in was not completed', { type: 'error', autoClose: 5000 });
    });
  };

  const signOut = () => {
    return getFirebaseContext().auth.signOut();
  };

  const upgrade = async () => {
    if (!props.user) {
      return;
    }

    setLoadingUpgrade(true);

    try {
      const checkoutUrl = await customerRepository.createCheckoutSession(props.user.uid);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setLoadingUpgrade(false);

      console.error(error);
      toast(`There was an error with the payment platform`, {
        type: 'error',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (props.user) {
      customerRepository.getSubscription(props.user.uid).then(setSubscription);
    }
  }, [props.user]);

  return (
    <div style={{ paddingBottom: 8 }}>
      <NavLink style={{ marginRight: 8 }} to={RouteNames.home}>
        Home
      </NavLink>
      <NavLink style={{ marginRight: 8 }} to={RouteNames.myTabs}>
        My tabs
      </NavLink>
      {props.user ? (
        <React.Fragment>
          {subscription ? (
            <button
              disabled={loadingUpgrade}
              onClick={manageSubscription}
              style={{ marginRight: 8 }}
            >
              Manage subscription
            </button>
          ) : (
            <button disabled={loadingUpgrade} onClick={upgrade} style={{ marginRight: 8 }}>
              Upgrade
            </button>
          )}
          <button onClick={signOut}>Sign out</button>
        </React.Fragment>
      ) : (
        <button onClick={signIn}>Sign in with google</button>
      )}
    </div>
  );
};
