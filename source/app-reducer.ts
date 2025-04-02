import { ActionType } from './action-type';
import { AppAction } from './app-action';
import { AppState } from './app-state';

export const appReducer = (state: AppState, action: AppAction): AppState => {
  if (action.type === ActionType.authStateChanged) {
    return {
      ...state,
      user: action.payload,
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
        document: action.payload,
      },
    };
  }

  return state;
};
