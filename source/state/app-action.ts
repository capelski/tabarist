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
      barContainers: BarContainer[];
    }
  | {
      type: ActionType.authStateChanged;
      user: User | null;
    }
  | {
      type: ActionType.clearNavigation;
    }
  | {
      type: ActionType.createTab;
    }
  | {
      type: ActionType.deleteCancel;
    }
  | {
      type: ActionType.deleteConfirm;
      navigate?: AppState['navigate'];
    }
  | {
      type: ActionType.deletePrompt;
      tab: Tab;
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
      subscription: StripeSubscription;
    }
  | {
      type: ActionType.setTab;
      navigate?: AppState['navigate'];
      tab: Tab;
    }
  | {
      type: ActionType.signInFinish;
    }
  | {
      type: ActionType.signInStart;
      message?: string;
    }
  | {
      type: ActionType.updateTab;
      tab: Tab;
    };
