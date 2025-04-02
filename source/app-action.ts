import { User } from 'firebase/auth';
import { ActionType } from './action-type';
import { Tab } from './types';

export type AppAction =
  | {
      type: ActionType.authStateChanged;
      payload: User | null;
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
