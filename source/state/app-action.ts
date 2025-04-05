import { User } from 'firebase/auth';
import { BarContainer, StripeSubscription, Tab } from '../types';
import { ActionType } from './action-type';
import { AppState } from './app-state';

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
      navigate?: AppState['navigate'];
    }
  | {
      type: ActionType.discardChangesPrompt;
      navigate?: AppState['navigate'];
    }
  | {
      type: ActionType.enterEditMode;
      navigate?: AppState['navigate'];
    }
  | {
      type: ActionType.loaderDisplay;
    }
  | {
      type: ActionType.loaderHide;
    }
  | {
      type: ActionType.setStripeSubscription;
      payload: StripeSubscription;
    }
  | {
      type: ActionType.setTab;
      document: Tab;
      navigate?: AppState['navigate'];
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
