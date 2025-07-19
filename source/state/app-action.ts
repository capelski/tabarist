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
      type: ActionType.fetchStarredTabsEnd;
      navigate?: AppState['navigate'];
      response: PagedResponse<StarredTab>;
    }
  | {
      type: ActionType.fetchStarredTabsStart;
    }
  | {
      type: ActionType.fetchTabsEnd;
      navigate?: AppState['navigate'];
      response: PagedResponse<Tab>;
      route: RouteNames.home | RouteNames.myTabs;
    }
  | {
      type: ActionType.fetchTabsStart;
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
      type: ActionType.searchParamsReady;
    }
  | {
      type: ActionType.setStarredListParameters;
      params: StarredListParameters;
      skipUrlUpdate?: boolean;
    }
  | {
      type: ActionType.setTabListParams;
      params: TabListParameters;
      route: RouteNames.home | RouteNames.myTabs;
      skipUrlUpdate?: boolean;
    }
  | {
      type: ActionType.setStarredTab;
      starredTab: boolean;
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
    }
  | {
      type: ActionType.upgradeCancel;
    }
  | {
      type: ActionType.upgradeStart;
      message?: string;
    };
