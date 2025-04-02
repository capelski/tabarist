import { User } from 'firebase/auth';
import { AppProps } from './app';
import { Tab } from './types';

export type AppState = {
  signInDialog:
    | {
        message?: string;
      }
    | undefined;
  tab: {
    discardChangesModal?: boolean;
    document: Tab | undefined;
    isDirty?: boolean;
    isDraft?: boolean;
    isEditMode?: boolean;
    /** Snapshot of the unmodified document */
    originalDocument?: string;
  };
  user: User | null;
};

export const getInitialState = (props: AppProps): AppState => ({
  signInDialog: undefined,
  tab: {
    document: props.tab,
  },
  user: null,
});
