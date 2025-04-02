import { User } from 'firebase/auth';
import { Tab } from '../types';
import { ActionType } from './action-type';

export type AppAction =
  | {
      type: ActionType.authStateChanged;
      payload: User | null;
    }
  | {
      type: ActionType.clearNavigation;
    }
  | {
      type: ActionType.createTab;
    }
  | {
      type: ActionType.discardChangesCancel;
    }
  | {
      type: ActionType.discardChangesConfirm;
    }
  | {
      type: ActionType.discardChangesPrompt;
    }
  | {
      type: ActionType.setTab;
      payload: {
        isDraft?: boolean;
        isEditMode?: boolean;
        document: Tab;
      };
    }
  | {
      type: ActionType.signInFinish;
    }
  | {
      type: ActionType.signInStart;
      payload?: string;
    }
  | {
      type: ActionType.updateTab;
      payload: Tab;
    };
