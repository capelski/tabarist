import { User } from 'firebase/auth';
import { AppProps } from '../app';
import { RouteNames } from '../constants';
import { ActiveSlot, StripeSubscription, Tab, TabPageResponse, TabQueryParameters } from '../types';

export type TabListState = {
  data?: TabPageResponse;
  loading?: boolean;
  params: TabQueryParameters;
  skipUrlUpdate?: boolean;
};

export type AppState = {
  deletingTab?: Tab;
  [RouteNames.home]: TabListState;
  loading?: boolean;
  [RouteNames.myTabs]: TabListState;
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
  tab: {
    document: props.tab,
  },
  user: {
    document: null,
  },
});
