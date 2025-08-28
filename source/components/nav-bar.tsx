import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { RouteNames } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { customerRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { StripeSubscription } from '../types';
import { PromptChangesLink } from './common/prompt-changes-link';
import { createNewTab } from './tab';

export type NavBarProps = {
  isTabDirty: boolean;
  loading?: true;
  subscription?: StripeSubscription;
  user: User | null;
};

export const NavBar: React.FC<NavBarProps> = (props) => {
  const { dispatch, state } = useContext(StateProvider);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const manageSubscription = async () => {
    if (props.loading) {
      return;
    }

    if (props.isTabDirty) {
      dispatch({ type: ActionType.discardChangesPrompt });
      return;
    }

    dispatch({ type: ActionType.loaderDisplay });

    try {
      const url = await customerRepository.getPortalLink();
      window.location.assign(url);
    } catch (error) {
      dispatch({ type: ActionType.loaderHide });

      console.error(error);
      toast('An error occurred while connecting to Stripe', {
        type: 'error',
        autoClose: 5000,
      });
    }
  };

  const signOut = () => {
    if (props.isTabDirty) {
      dispatch({ type: ActionType.discardChangesPrompt });
      return;
    }

    getFirebaseContext().auth.signOut();
    if (pathname === RouteNames.myTabs) {
      navigate(RouteNames.home);
    }
  };

  const upgrade = async () => {
    if (!props.user || props.loading) {
      return;
    }

    if (props.isTabDirty) {
      dispatch({ type: ActionType.discardChangesPrompt });
      return;
    }

    dispatch({ type: ActionType.upgradeStart });
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <PromptChangesLink
          className="navbar-brand"
          isTabDirty={props.isTabDirty}
          to={RouteNames.home}
        >
          Tabarist
        </PromptChangesLink>

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
                onClick={() => {
                  createNewTab(state, dispatch, navigate);
                }}
                style={{ cursor: 'pointer' }}
              >
                New tab
              </a>
            </li>

            {props.user && !props.subscription && (
              <li className="nav-item">
                <button className="btn btn-success" onClick={upgrade} style={{ margin: '0 8px' }}>
                  Upgrade
                </button>
              </li>
            )}
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
                  <PromptChangesLink
                    className="dropdown-item"
                    isTabDirty={props.isTabDirty}
                    to={RouteNames.starredTabs}
                  >
                    Starred tabs
                  </PromptChangesLink>
                </li>
                <li>
                  <PromptChangesLink
                    className="dropdown-item"
                    isTabDirty={props.isTabDirty}
                    to={RouteNames.myTabs}
                  >
                    My tabs
                  </PromptChangesLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  {props.subscription && (
                    <a
                      className="dropdown-item"
                      onClick={manageSubscription}
                      style={{ cursor: 'pointer' }}
                    >
                      Manage subscription
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
            <button
              className="btn btn-success"
              onClick={() => {
                dispatch({ type: ActionType.signInStart });
              }}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
