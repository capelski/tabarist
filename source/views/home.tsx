import React, { useContext, useEffect } from 'react';
import { TabList } from '../components';
import { RouteNames } from '../constants';
import { getTabListRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { MetaTags } from './common/meta-tags';

const currentRoute = RouteNames.home;

export const HomeView: React.FC = () => {
  const { dispatch, state } = useContext(StateProvider);

  const listState = state[currentRoute];

  const fetchTabs = async () => {
    dispatch({ type: ActionType.fetchTabsStart, route: currentRoute });

    const response = await tabRepository.getPublicTabs(listState.params);

    dispatch({
      type: ActionType.fetchTabsEnd,
      navigate: listState.skipUrlUpdate
        ? undefined
        : { to: [getTabListRelativeUrl(currentRoute, listState.params)] },
      response,
      route: currentRoute,
    });
  };

  useEffect(() => {
    if (state.searchParamsReady && !listState.data && !listState.loading) {
      fetchTabs();
    }
  }, [listState, state.searchParamsReady]);

  return (
    <React.Fragment>
      <MetaTags title="Tabarist" />

      <TabList
        deletingTab={state.deletingTab}
        listState={listState}
        user={state.user.document}
        route={currentRoute}
      />
    </React.Fragment>
  );
};
