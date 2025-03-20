import React from 'react';
import { tabRepository } from '../repositories';
import { TabPageResponse } from '../types';
import { TabListBaseProps, TabListView } from './tab-list';

export const MyTabsView: React.FC<TabListBaseProps> = (props) => {
  return (
    <TabListView
      {...props}
      getTabs={(params) => {
        return props.user
          ? tabRepository.getUserTabs(props.user.uid, params)
          : Promise.resolve<TabPageResponse>({
              hasNextPage: false,
              hasPreviousPage: false,
              tabs: [],
            });
      }}
    />
  );
};
