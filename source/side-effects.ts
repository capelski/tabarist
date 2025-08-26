import { Dispatch, useEffect } from 'react';
import { useBeforeUnload, useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { QueryParameters, RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { getTabRelativeUrl } from './operations';
import { customerRepository } from './repositories';
import {
  ActionType,
  AppAction,
  AppState,
  loadHomeTabs,
  loadMyTabs,
  loadStarredTabs,
} from './state';
import { CursorDirection, StarredListParameters, TabListParameters } from './types';

const getTabListParameters = (searchParams: URLSearchParams): TabListParameters => {
  const titleParameter = searchParams.get(QueryParameters.title);
  const cDParameter = searchParams.get(QueryParameters.cursorDirection);
  const cVParameters = searchParams.getAll(QueryParameters.cursorValues + '[]');

  return {
    cursor:
      cDParameter && cVParameters.length
        ? {
            direction: cDParameter as CursorDirection,
            values: cVParameters,
          }
        : undefined,
    titleFilter: titleParameter ?? undefined,
  };
};

const getStarredListParameters = (searchParams: URLSearchParams): StarredListParameters => {
  const cDParameter = searchParams.get(QueryParameters.cursorDirection);
  const cVParameters = searchParams.getAll(QueryParameters.cursorValues + '[]');

  return {
    cursor:
      cDParameter && cVParameters.length
        ? {
            direction: cDParameter as CursorDirection,
            values: cVParameters,
          }
        : undefined,
  };
};

export const useSideEffects = (state: AppState, dispatch: Dispatch<AppAction>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  // Retrieve the authenticated user and their subscription
  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(
      (user) => {
        if (user) {
          customerRepository.getSubscription(user.uid).then((subscription) => {
            dispatch({ type: ActionType.setUser, subscription, user });
          });
        } else if (state.user.document) {
          dispatch({ type: ActionType.setUser, subscription: undefined, user: null });
        }
      },
      (error) => {
        console.log(error);
        toast('Could not reach the user account', { type: 'error' });
      },
    );
  }, []);

  // Effects triggered by navigation events
  useEffect(() => {
    if (pathname === RouteNames.home) {
      const params = getTabListParameters(searchParams);
      loadHomeTabs(params, dispatch);
    }
  }, [pathname, searchParams]);

  // Effects triggered by navigation events that require a logged in user
  useEffect(() => {
    if (state.user.document) {
      if (pathname === RouteNames.myTabs) {
        const params = getTabListParameters(searchParams);
        loadMyTabs(state.user.document.uid, params, dispatch);
      } else if (pathname === RouteNames.starredTabs) {
        const params = getStarredListParameters(searchParams);
        loadStarredTabs(state.user.document.uid, params, dispatch);
      }
    }
  }, [pathname, searchParams, state.user]);

  // Update the state upon browser back/forward navigation events
  useEffect(() => {
    const editModeParam = searchParams.get(QueryParameters.editMode) === 'true';
    if (editModeParam && !state.tab.isEditMode) {
      dispatch({ type: ActionType.enterEditMode });
    } else if (!editModeParam && state.tab.isEditMode) {
      if (state.tab.isDirty) {
        dispatch({
          type: ActionType.discardChangesPrompt,
          navigate: { to: [getTabRelativeUrl(state.tab.document!.id, true)] },
        });
      } else {
        dispatch({ type: ActionType.discardChangesConfirm });
      }
    }
  }, [searchParams]);

  // Trigger navigation events via state
  useEffect(() => {
    if (state.navigate?.to && state.navigate?.to.length > 0) {
      navigate(state.navigate.to[0]);
      dispatch({ type: ActionType.clearNavigation });
    } else if (state.navigate?.back) {
      window.history.back();
      dispatch({ type: ActionType.clearNavigation });
    }
  }, [state.navigate]);

  // Prevent the user from navigating away if there are unsaved changes
  useBeforeUnload((event) => {
    if (state.tab.isDirty) {
      event.preventDefault();
    }
  });
};
