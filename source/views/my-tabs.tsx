import React from 'react';
import { TabList, TabListBaseProps } from '../components/tab/tab-list';
import { tabRepository } from '../repositories';
import { TabPageResponse } from '../types';
import { MetaTags } from './common/meta-tags';

export const MyTabsView: React.FC<TabListBaseProps> = (props) => {
  return (
    <React.Fragment>
      <MetaTags title="Tabarist - My tabs" />

      <TabList
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
    </React.Fragment>
  );
};
