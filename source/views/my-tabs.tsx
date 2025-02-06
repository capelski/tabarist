import React from 'react';
import { User } from '../firebase';
import { tabRepository } from '../repositories';
import { TabPageResponse } from '../repositories/tab.repository-interface';
import { TabListView } from './tab-list';

export type MyTabsViewProps = {
  user: User | null;
};

export const MyTabsView: React.FC<MyTabsViewProps> = (props) => {
  return (
    <TabListView
      getTabs={(params) => {
        return props.user
          ? tabRepository.getUserTabs(props.user.uid, params)
          : Promise.resolve<TabPageResponse>({ isLastPage: true, tabs: [] });
      }}
      user={props.user}
    />
  );
};
