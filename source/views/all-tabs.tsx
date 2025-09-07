import React, { useContext } from 'react';
import { TabList } from '../components';
import { RouteNames } from '../constants';
import { StateProvider } from '../state';
import { MetaTags } from './common/meta-tags';

const currentRoute = RouteNames.allTabs;

export const AllTabsView: React.FC = () => {
  const { state } = useContext(StateProvider);

  const listState = state[currentRoute];

  return (
    <React.Fragment>
      <MetaTags title="Tabarist - All tabs" />

      <TabList listState={listState} user={state.user.document} route={currentRoute} />
    </React.Fragment>
  );
};
