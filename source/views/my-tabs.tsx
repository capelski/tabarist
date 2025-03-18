import React from 'react';
import { User } from '../firebase';
import { tabRepository } from '../repositories';
import { TabPageResponse } from '../types';
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
          : Promise.resolve<TabPageResponse>({
              hasNextPage: false,
              hasPreviousPage: false,
              tabs: [],
            });
      }}
      user={props.user}
    />
  );
};
