import { Dispatch, useEffect } from 'react';
import { useBeforeUnload, useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { QueryParameters, RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { customerRepository } from './repositories';
import {
  ActionType,
  AppAction,
  AppState,
  loadAllTabs,
  loadMyTabs,
  loadStarredTabs,
  loadTabDetails,
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

let isAuthStateChange = false;

export const useSideEffects = (state: AppState, dispatch: Dispatch<AppAction>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  // Retrieve the authenticated user and their subscription
  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(
      (user) => {
        isAuthStateChange = true;

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
    const isEditMode = searchParams.get(QueryParameters.editMode) === 'true';
    const enteringEditMode = isEditMode && !state.tab.isEditMode;
    const exitingEditMode = !isEditMode && state.tab.isEditMode;

    if (exitingEditMode && state.tab.isDirty) {
      // This can only happen when navigating back via browser back button
      // Restore the previous URL and prompt the user
      navigate(1);
      dispatch({ type: ActionType.discardChangesPrompt });
      return;
    }

    if (pathname === RouteNames.allTabs && !isAuthStateChange) {
      const params = getTabListParameters(searchParams);
      loadAllTabs(params, dispatch);
    } else if (pathname === RouteNames.myTabs && state.user.document) {
      const params = getTabListParameters(searchParams);
      loadMyTabs(state.user.document.uid, params, dispatch);
    } else if (pathname === RouteNames.starredTabs && state.user.document) {
      const params = getStarredListParameters(searchParams);
      loadStarredTabs(state.user.document.uid, params, dispatch);
    } else {
      const tabDetailsRegExp = new RegExp(RouteNames.tabDetails.replace(':tabId', '(.+)'));
      const tabDetailsMatch = pathname.match(tabDetailsRegExp);
      if (tabDetailsMatch) {
        const tabId = tabDetailsMatch[1];

        if (tabId === 'new' && (tabId !== state.tab.document?.id || isAuthStateChange)) {
          dispatch({
            type: ActionType.createTab,
            isEditMode,
          });
        } else if (tabId !== 'new' && state.tab.document?.id === 'new') {
          if (state.tab.isEditMode) {
            dispatch({ type: ActionType.editModeCancel });
          }
          loadTabDetails(tabId, state.user.document?.uid, dispatch);
        } else if (enteringEditMode) {
          dispatch({ type: ActionType.editModeEnter });
        } else if (exitingEditMode && !state.tab.isDirty) {
          dispatch({ type: ActionType.editModeCancel });
        } else if (tabId !== state.tab.document?.id || isAuthStateChange) {
          loadTabDetails(tabId, state.user.document?.uid, dispatch);
        }
      }
    }

    isAuthStateChange = false;
  }, [pathname, searchParams, state.user]);

  // Prevent the user from navigating away if there are unsaved changes
  useBeforeUnload((event) => {
    if (state.tab.isDirty) {
      event.preventDefault();
    }
  });
};
