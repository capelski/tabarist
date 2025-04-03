import { User } from 'firebase/auth';
import { BarContainer, Tab } from '../types';
import { ActionType } from './action-type';

export type AppAction =
  | {
      type: ActionType.activeSlotClear;
    }
  | {
      type: ActionType.activeSlotUpdate;
      payload: BarContainer[];
    }
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
      type: ActionType.enterEditMode;
    }
  | {
      type: ActionType.loaderDisplay;
    }
  | {
      type: ActionType.loaderHide;
    }
  | {
      type: ActionType.setTab;
      payload: {
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
