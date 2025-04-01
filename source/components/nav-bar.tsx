import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { RouteNames } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { customerRepository } from '../repositories';

export type NavBarProps = {
  isCurrentTabDirty: boolean;
  createTab: () => void;
  promptDiscardChanges: () => void;
  startSignIn: () => void;
  user: User | null;
};

export const NavBar: React.FC<NavBarProps> = (props) => {
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [subscription, setSubscription] = useState<any>();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const manageSubscription = async () => {
    if (props.isCurrentTabDirty) {
      props.promptDiscardChanges();
      return;
    }

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

  const signOut = () => {
    if (props.isCurrentTabDirty) {
      props.promptDiscardChanges();
      return;
    }

    getFirebaseContext().auth.signOut();
    if (pathname === RouteNames.myTabs) {
      navigate(RouteNames.home);
    }
  };

  const upgrade = async () => {
    if (!props.user) {
      return;
    }

    if (props.isCurrentTabDirty) {
      props.promptDiscardChanges();
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
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          onClick={(event) => {
            if (props.isCurrentTabDirty) {
              props.promptDiscardChanges();
              event.preventDefault();
            }
          }}
          to={RouteNames.home}
        >
          Tabarist
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a
                className="nav-link mb-2 mb-sm-0"
                onClick={props.createTab}
                style={{ cursor: 'pointer' }}
              >
                New tab
              </a>
            </li>
          </ul>

          {props.user ? (
            <div className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                {props.user.displayName ?? 'User'}
              </a>
              <ul className="dropdown-menu dropdown-menu-sm-end" aria-labelledby="navbarDropdown">
                <li>
                  <NavLink
                    className="dropdown-item"
                    onClick={(event) => {
                      if (props.isCurrentTabDirty) {
                        props.promptDiscardChanges();
                        event.preventDefault();
                      }
                    }}
                    to={RouteNames.myTabs}
                  >
                    My tabs
                  </NavLink>
                </li>
                <li>
                  {subscription ? (
                    <a
                      className={`dropdown-item${loadingUpgrade ? ' disabled' : ''}`}
                      onClick={loadingUpgrade ? undefined : manageSubscription}
                      style={{ cursor: 'pointer' }}
                    >
                      Manage subscription
                    </a>
                  ) : (
                    <a
                      className={`dropdown-item${loadingUpgrade ? ' disabled' : ''}`}
                      onClick={loadingUpgrade ? undefined : upgrade}
                      style={{ cursor: 'pointer' }}
                    >
                      Upgrade
                    </a>
                  )}
                </li>
                <li>
                  <a className="dropdown-item" onClick={signOut} style={{ cursor: 'pointer' }}>
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <button className="btn btn-success" onClick={props.startSignIn}>
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
