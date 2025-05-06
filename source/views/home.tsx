import React, { useContext, useEffect } from 'react';
import { TabList, TabListBaseProps } from '../components';
import { RouteNames } from '../constants';
import { getTabListRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { MetaTags } from './common/meta-tags';

export type HomeViewProps = TabListBaseProps & {
  searchParamsReady: boolean;
};

const currentRoute = RouteNames.home;

export const HomeView: React.FC<HomeViewProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const fetchTabs = async () => {
    dispatch({ type: ActionType.fetchTabsStart, route: currentRoute });

    const response = await tabRepository.getPublicTabs(props.listState.params);

    dispatch({
      type: ActionType.fetchTabsEnd,
      navigate: props.listState.skipUrlUpdate
        ? undefined
        : { to: [getTabListRelativeUrl(currentRoute, props.listState.params)] },
      response,
      route: currentRoute,
    });
  };

  useEffect(() => {
    if (props.searchParamsReady && !props.listState.data && !props.listState.loading) {
      fetchTabs();
    }
  }, [props.listState, props.searchParamsReady]);

  return (
    <React.Fragment>
      <MetaTags title="Tabarist" />

      <TabList {...props} route={currentRoute} />
    </React.Fragment>
  );
};
