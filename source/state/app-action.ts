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

export type AppAction =
  | {
      type: ActionType.activeSlotClear;
    }
  | {
      type: ActionType.activeSlotUpdate;
      barContainers: BarContainer[];
    }
  | {
      type: ActionType.createTab;
      isEditMode: boolean;
    }
  | {
      type: ActionType.deleteCancel;
    }
  | {
      type: ActionType.deleteConfirm;
    }
  | {
      type: ActionType.deletePrompt;
      tab: Tab;
    }
  | {
      type: ActionType.discardChangesCancel;
    }
  | {
      type: ActionType.discardChangesPrompt;
    }
  | {
      type: ActionType.editModeCancel;
    }
  | {
      type: ActionType.editModeEnter;
    }
  | {
      type: ActionType.editModeSave;
      /** Passing the tab so handlers can modify the document if needed */
      tab: Tab;
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
      type: ActionType.fetchTabDetailsEnd;
      starredTabId: string | undefined;
      tab: Tab | undefined;
    }
  | {
      type: ActionType.fetchTabDetailsStart;
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
      type: ActionType.setStarredTabId;
      starredTabId: string | undefined;
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
