import { ActionType } from './action-type';
import { AppAction } from './app-action';
import { AppState } from './app-state';
import { getTabRelativeUrl, tabOperations } from './operations';

const getDiscardChangesState = (state: AppState): AppState => ({
  ...state,
  tab: {
    ...state.tab,
    discardChangesModal: undefined,
    document: JSON.parse(state.tab.originalDocument!),
    isDirty: false,
    isEditMode: undefined,
    originalDocument: undefined,
  },
});

const getDiscardPromptState = (state: AppState): AppState => ({
  ...state,
  tab: {
    ...state.tab,
    discardChangesModal: true,
  },
});

export const appReducer = (state: AppState, action: AppAction): AppState => {
  if (action.type === ActionType.authStateChanged) {
    return {
      ...state,
      user: action.payload,
    };
  }
  if (action.type === ActionType.clearNavigation) {
    return {
      ...state,
      navigateTo: undefined,
    };
  }

  if (action.type === ActionType.createTab) {
    if (!state.user) {
      return {
        ...state,
        signInDialog: { message: 'Sign in to start creating tabs' },
      };
    }

    if (state.tab.isDirty) {
      return getDiscardPromptState(state);
    }

    const document = tabOperations.create(state.user.uid);
    return {
      ...state,
      navigateTo: getTabRelativeUrl(document.id, true),
      tab: {
        document,
        isDraft: true,
        isEditMode: true,
        originalDocument: JSON.stringify(document),
      },
    };
  }

  if (action.type === ActionType.discardChangesCancel) {
    return {
      ...state,
      tab: {
        ...state.tab,
        discardChangesModal: undefined,
      },
    };
  }

  if (action.type === ActionType.discardChangesConfirm) {
    return getDiscardChangesState(state);
  }

  if (action.type === ActionType.discardChangesPrompt) {
    return state.tab.isDirty ? getDiscardPromptState(state) : getDiscardChangesState(state);
  }

  if (action.type === ActionType.setTab) {
    return {
      ...state,
      tab: {
        ...state.tab,
        document: action.payload.document,
        isDirty: undefined,
        isDraft: action.payload.isDraft,
        isEditMode: action.payload.isEditMode,
        originalDocument: JSON.stringify(action.payload.document),
      },
    };
  }

  if (action.type === ActionType.signInFinish) {
    return {
      ...state,
      signInDialog: undefined,
    };
  }

  if (action.type === ActionType.signInStart) {
    return {
      ...state,
      signInDialog: {
        message: action.payload,
      },
    };
  }

  if (action.type === ActionType.updateTab) {
    return {
      ...state,
      tab: {
        ...state.tab,
        isDirty: JSON.stringify(action.payload) !== state.tab.originalDocument,
        document: action.payload,
      },
    };
  }

  return state;
};
