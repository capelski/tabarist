import { User } from 'firebase/auth';
import { RouteNames } from '../constants';
import {
  BarContainer,
  PagedResponse,
  PositionOperation,
  SectionBar,
  StarredListParameters,
  StarredTab,
  StripeSubscription,
  Tab,
  TabListParameters,
} from '../types';
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
      type: ActionType.fetchStarredTabsEnd;
      response: PagedResponse<StarredTab>;
    }
  | {
      type: ActionType.fetchStarredTabsStart;
      params: StarredListParameters;
    }
  | {
      type: ActionType.fetchTabsEnd;
      response: PagedResponse<Tab>;
      route: RouteNames.home | RouteNames.myTabs;
    }
  | {
      type: ActionType.fetchTabsStart;
      params: TabListParameters;
      route: RouteNames.home | RouteNames.myTabs;
    }
  | {
      type: ActionType.loaderDisplay;
    }
  | {
      type: ActionType.loaderHide;
    }
  | {
      type: ActionType.positionOperationCancel;
    }
  | {
      type: ActionType.positionOperationEnd;
      endIndex: number;
      parentSection?: SectionBar;
    }
  | {
      type: ActionType.positionOperationStart;
      positionOperation: PositionOperation;
    }
  | {
      type: ActionType.setStarredTab;
      starredTab: StarredTab | undefined;
    }
  | {
      type: ActionType.setTab;
      navigate?: AppState['navigate'];
      tab: Tab;
    }
  | {
      type: ActionType.setUser;
      subscription: StripeSubscription | undefined;
      user: User | null;
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
    }
  | {
      type: ActionType.upgradeCancel;
    }
  | {
      type: ActionType.upgradeStart;
      message?: string;
    };
