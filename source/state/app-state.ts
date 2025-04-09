import { User } from 'firebase/auth';
import { AppProps } from '../app';
import { RouteNames } from '../constants';
import {
  ActiveSlot,
  PageResponse,
  StarredListParameters,
  StarredTab,
  StripeSubscription,
  Tab,
  TabQueryParameters,
} from '../types';

export type ListState<TData, TParams> = {
  data?: PageResponse<TData>;
  loading?: boolean;
  params: TParams;
  skipUrlUpdate?: boolean;
};

export type AppState = {
  deletingTab?: Tab;
  [RouteNames.home]: ListState<Tab, TabQueryParameters>;
  loading?: boolean;
  [RouteNames.myTabs]: ListState<Tab, TabQueryParameters>;
  navigate?:
    | {
        back?: undefined;
        to: string[];
      }
    | {
        back: true;
        to?: undefined;
      };
  /** Used to delay data fetching operations until query string parameters have been parsed */
  searchParamsReady: boolean;
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
    isStarred?: boolean;
    /** Snapshot of the unmodified document */
    originalDocument?: string;
  };
  user: {
    document: User | null;
    stripeSubscription?: StripeSubscription;
  };
};

export const getInitialState = (props: AppProps): AppState => ({
  [RouteNames.home]: {
    params: {},
  },
  [RouteNames.myTabs]: {
    params: {},
  },
  searchParamsReady: false,
  starredTabs: {
    params: {},
  },
  tab: {
    document: props.tab,
  },
  user: {
    document: null,
  },
});
