import { Dispatch, useEffect } from 'react';
import { useBeforeUnload, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import { QueryParameters } from './constants';
import { getFirebaseContext } from './firebase-context';
import { getTabRelativeUrl } from './operations';
import { customerRepository } from './repositories';
import { ActionType, AppAction, AppState } from './state';

export const useSideEffects = (state: AppState, dispatch: Dispatch<AppAction>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Retrieve the authenticated user and their subscription
  useEffect(() => {
    getFirebaseContext().auth.onAuthStateChanged(
      (user) => {
        dispatch({ type: ActionType.authStateChanged, payload: user });
        if (user) {
          customerRepository.getSubscription(user.uid).then((subscription) => {
            dispatch({ type: ActionType.setStripeSubscription, payload: subscription });
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
