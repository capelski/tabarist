import { Dispatch, useEffect } from 'react';
import { useBeforeUnload, useLocation, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { QueryParameters, RouteNames } from './constants';
import { getFirebaseContext } from './firebase-context';
import { getTabRelativeUrl } from './operations';
import { customerRepository } from './repositories';
import { ActionType, AppAction, AppState } from './state';
import { AnchorDirection, StarredListParameters, TabListParameters } from './types';

export const useSideEffects = (state: AppState, dispatch: Dispatch<AppAction>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  // Retrieve the authenticated user and their subscription
  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(
      (user) => {
        dispatch({ type: ActionType.authStateChanged, user });
        if (user) {
          customerRepository.getSubscription(user.uid).then((subscription) => {
            dispatch({ type: ActionType.setStripeSubscription, subscription });
          });
        }
      },
      (error) => {
        console.log(error);
        toast('Could not reach the user account', { type: 'error' });
      },
    );
  }, []);

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

    if (pathname === RouteNames.home || pathname === RouteNames.myTabs) {
      const titleParameter = searchParams.get(QueryParameters.title);
      const aDParameter = searchParams.get(QueryParameters.anchorDirection);
      const aIParameter = searchParams.get(QueryParameters.anchorId);
      const aTParameter = searchParams.get(QueryParameters.anchorTitle);

      const currentParams = state[pathname].params;

      if (
        !currentParams ||
        titleParameter !== currentParams.titleFilter ||
        aDParameter !== currentParams.anchorDocument?.direction ||
        aIParameter !== currentParams.anchorDocument?.id ||
        aTParameter !== currentParams.anchorDocument?.title
      ) {
        const nextParams: TabListParameters = {
          anchorDocument:
            aDParameter && aIParameter && aTParameter
              ? {
                  direction: aDParameter as AnchorDirection,
                  id: aIParameter,
                  title: aTParameter,
                }
              : undefined,
          titleFilter: titleParameter ?? undefined,
        };

        dispatch({
          type: ActionType.setTabListParams,
          params: nextParams,
          route: pathname,
          skipUrlUpdate: true,
        });
      }
    }

    if (pathname === RouteNames.starredTabs) {
      const aDParameter = searchParams.get(QueryParameters.anchorDirection);
      const aIParameter = searchParams.get(QueryParameters.anchorId);

      const currentParams = state.starredTabs.params;

      if (
        !currentParams ||
        aDParameter !== currentParams.anchorDocument?.direction ||
        aIParameter !== currentParams.anchorDocument?.id
      ) {
        const nextParams: StarredListParameters = {
          anchorDocument:
            aDParameter && aIParameter
              ? {
                  direction: aDParameter as AnchorDirection,
                  id: aIParameter,
                }
              : undefined,
        };

        dispatch({
          type: ActionType.setStarredListParameters,
          params: nextParams,
          skipUrlUpdate: true,
        });
      }
    }

    if (!state.searchParamsReady) {
      dispatch({ type: ActionType.searchParamsReady });
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
