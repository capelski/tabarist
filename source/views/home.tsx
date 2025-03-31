import React from 'react';
import { TabList, TabListBaseProps } from '../components/tab/tab-list';
import { tabRepository } from '../repositories';
import { MetaTags } from './common/meta-tags';

export const HomeView: React.FC<TabListBaseProps> = (props) => {
  return (
    <React.Fragment>
      <MetaTags title="Tabarist" />

      <TabList {...props} getTabs={(params) => tabRepository.getPublicTabs(params)} />
    </React.Fragment>
  );
};
