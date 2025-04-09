import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { RouteNames } from '../constants';
import { getFirebaseContext } from '../firebase-context';
import { customerRepository } from '../repositories';
import { ActionType, DispatchProvider } from '../state';
import { StripeSubscription } from '../types';

export type NavBarProps = {
  isCurrentTabDirty: boolean;
  loading?: boolean;
  subscription?: StripeSubscription;
  user: User | null;
};

export const NavBar: React.FC<NavBarProps> = (props) => {
  const dispatch = useContext(DispatchProvider);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const manageSubscription = async () => {
    if (props.loading) {
      return;
    }

    if (props.isCurrentTabDirty) {
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
    if (props.isCurrentTabDirty) {
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

    if (props.isCurrentTabDirty) {
      dispatch({ type: ActionType.discardChangesPrompt });
      return;
    }

    dispatch({ type: ActionType.loaderDisplay });

    try {
      const checkoutUrl = await customerRepository.createCheckoutSession(props.user.uid);
      window.location.assign(checkoutUrl);
    } catch (error) {
      dispatch({ type: ActionType.loaderHide });

      console.error(error);
      toast('An error occurred while connecting to Stripe', {
        type: 'error',
        autoClose: 5000,
      });
    }
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand"
          onClick={(event) => {
            if (props.isCurrentTabDirty) {
              dispatch({ type: ActionType.discardChangesPrompt });
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
                onClick={() => {
                  dispatch({ type: ActionType.createTab });
                }}
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
                        dispatch({ type: ActionType.discardChangesPrompt });
                        event.preventDefault();
                      }
                    }}
                    to={RouteNames.starredTabs}
                  >
                    Starred tabs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item"
                    onClick={(event) => {
                      if (props.isCurrentTabDirty) {
                        dispatch({ type: ActionType.discardChangesPrompt });
                        event.preventDefault();
                      }
                    }}
                    to={RouteNames.myTabs}
                  >
                    My tabs
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  {props.subscription ? (
                    <a
                      className="dropdown-item"
                      onClick={manageSubscription}
                      style={{ cursor: 'pointer' }}
                    >
                      Manage subscription
                    </a>
                  ) : (
                    <a className="dropdown-item" onClick={upgrade} style={{ cursor: 'pointer' }}>
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
