import { Tab } from './tab.type';

export type TabPageResponse = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  tabs: Tab[];
};
