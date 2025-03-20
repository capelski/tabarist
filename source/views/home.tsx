import React from 'react';
import { tabRepository } from '../repositories';
import { TabListBaseProps, TabListView } from './tab-list';

export const HomeView: React.FC<TabListBaseProps> = (props) => {
  return <TabListView {...props} getTabs={(params) => tabRepository.getPublicTabs(params)} />;
};
