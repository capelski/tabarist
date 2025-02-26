import React from 'react';
import { User } from '../firebase';
import { tabRepository } from '../repositories';
import { TabListView } from './tab-list';

export type HomeViewProps = {
  user: User | null;
};

export const HomeView: React.FC<HomeViewProps> = (props) => {
  return (
    <TabListView getTabs={(params) => tabRepository.getPublicTabs(params)} user={props.user} />
  );
};
