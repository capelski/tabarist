import { User } from 'firebase/auth';
import { AppProps } from '../app';
import { RouteNames } from '../constants';
import {
  ActiveSlot,
  PagedResponse,
  PositionOperation,
  StarredListParameters,
  StarredTab,
  StripeSubscription,
  Tab,
  TabListParameters,
} from '../types';

export type ListState<TData, TParams> = {
  data?: PagedResponse<TData>;
  loading?: true;
  params: TParams;
};

export type AppState = {
  deletingTab?: Tab;
  [RouteNames.home]: ListState<Tab, TabListParameters>;
  loading?: true;
  [RouteNames.myTabs]: ListState<Tab, TabListParameters>;
  signInModal?: {
    message?: string;
  };
  starredTabs: ListState<StarredTab, StarredListParameters>;
  tab: {
    activeSlot?: ActiveSlot;
    discardChangesModal?: boolean;
    document: Tab | undefined;
    isDirty?: boolean;
    isDraft?: boolean;
    isEditMode?: boolean;
    loading?: true;
    /** Snapshot of the unmodified document */
    originalDocument?: string;
    positionOperation?: PositionOperation;
    starredTabId?: string;
  };
  upgradeModal?: {
    message?: string;
  };
  user: {
    document: User | null;
    stripeSubscription?: StripeSubscription;
  };
};

export const getInitialState = (props: AppProps): AppState => ({
  [RouteNames.home]: props.homeState ?? {
    params: {},
  },
  [RouteNames.myTabs]: {
    params: {},
  },
  starredTabs: {
    params: {},
  },
  tab: {
    document: props.tab,
    originalDocument: props.tab ? JSON.stringify(props.tab) : undefined,
  },
  user: {
    document: null,
  },
});
