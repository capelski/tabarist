import { User } from 'firebase/auth';
import { AppProps } from '../app';
import { ActiveSlot, StripeSubscription, Tab } from '../types';

export type AppState = {
  deletingTab?: Tab;
  loading?: boolean;
  navigate?:
    | {
        back?: undefined;
        to: string[];
      }
    | {
        back: true;
        to?: undefined;
      };
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
    /** Snapshot of the unmodified document */
    originalDocument?: string;
  };
  user: {
    document: User | null;
    stripeSubscription?: StripeSubscription;
  };
};

export const getInitialState = (props: AppProps): AppState => ({
  tab: {
    document: props.tab,
  },
  user: {
    document: null,
  },
});
