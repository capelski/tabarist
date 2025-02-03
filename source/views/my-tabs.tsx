import React from 'react';
import { User } from '../firebase';
import { tabRepository } from '../repositories';
import { Tab } from '../types';
import { TabListView } from './tab-list';

export type MyTabsViewProps = {
  user: User | null;
};

export const MyTabsView: React.FC<MyTabsViewProps> = (props) => {
  return (
    <TabListView
      getTabs={(titleFilter) => {
        return props.user
          ? tabRepository.getUserTabs(props.user.uid, titleFilter)
          : Promise.resolve([] as Tab[]);
      }}
      user={props.user}
    />
  );
};
