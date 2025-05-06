import React, { useContext, useEffect } from 'react';
import { TabList, TabListBaseProps } from '../components';
import { RouteNames } from '../constants';
import { getTabListRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { MetaTags } from './common/meta-tags';

export type MyTabsViewProps = TabListBaseProps & {
  searchParamsReady: boolean;
};

const currentRoute = RouteNames.myTabs;

export const MyTabsView: React.FC<MyTabsViewProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const fetchTabs = async () => {
    if (!props.user) {
      return;
    }

    dispatch({ type: ActionType.fetchTabsStart, route: currentRoute });
    const response = await tabRepository.getUserTabs(props.user.uid, props.listState.params);
    dispatch({
      type: ActionType.fetchTabsEnd,
      navigate: props.listState.skipUrlUpdate
        ? undefined
        : {
            to: [getTabListRelativeUrl(currentRoute, props.listState.params)],
          },
      response,
      route: currentRoute,
    });
  };

  useEffect(() => {
    if (
      props.user &&
      props.searchParamsReady &&
      !props.listState.data &&
      !props.listState.loading
    ) {
      fetchTabs();
    }
  }, [props.listState, props.searchParamsReady, props.user]);

  return (
    <React.Fragment>
      <MetaTags title="Tabarist - My tabs" />

      <TabList {...props} route={currentRoute} />
    </React.Fragment>
  );
};
