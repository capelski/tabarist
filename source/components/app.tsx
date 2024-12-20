import React from 'react';
import { createTab } from '../logic';
import { TabComponent } from './tab';

export const App: React.FC = () => {
  return <TabComponent tab={createTab()} />;
};
