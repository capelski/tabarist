import { Dispatch } from 'react';
import { NavigateFunction } from 'react-router';
import { getTabRelativeUrl } from '../../operations';
import { ActionType, AppAction, AppState } from '../../state';
import { Tab } from '../../types';

export const createNewTab = (
  state: AppState,
  dispatch: Dispatch<AppAction>,
  navigate: NavigateFunction,
) => {
  if (!state.user.document) {
    dispatch({ type: ActionType.signInStart, message: 'Sign in to start creating tabs' });
    return;
  }

  if (state.tab.isDirty) {
    dispatch({ type: ActionType.discardChangesPrompt });
    return;
  }

  navigate(getTabRelativeUrl('new', true));
};

/*
  When entering/exiting the edit mode replace the state so we do not accumulate
  multiple history entries on the tab details page
*/

export const enterEditMode = (tabId: string, navigate: NavigateFunction) => {
  navigate(getTabRelativeUrl(tabId, true), { replace: true });
};

export const exitEditMode = (
  tab: Tab,
  isDirty: boolean | undefined,
  dirtyChanges: 'discard' | 'prompt' | 'save',
  dispatch: Dispatch<AppAction>,
  navigate: NavigateFunction,
) => {
  if (isDirty && dirtyChanges === 'prompt') {
    dispatch({ type: ActionType.discardChangesPrompt });
    return;
  }

  if (isDirty && dirtyChanges === 'discard') {
    dispatch({ type: ActionType.editModeCancel });
  } else if (isDirty && dirtyChanges === 'save') {
    dispatch({ type: ActionType.editModeSave, tab });
  }

  navigate(getTabRelativeUrl(tab.id, false), { replace: true });
};

export const getYoutubeId = (backingTrack: string | undefined) => {
  const youtubeVideoId =
    backingTrack &&
    (/^https\:\/\/youtu\.be\/([^/?]*)/.exec(backingTrack)?.[1] ||
      /^https\:\/\/(?:www.)?youtube.com\/watch\?v=([^&]*)/.exec(backingTrack)?.[1] ||
      /https\:\/\/(?:www.)?youtube.com\/embed\/([^/?]*)/.exec(backingTrack)?.[1]);

  return youtubeVideoId;
};
