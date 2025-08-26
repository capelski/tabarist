import { Dispatch } from 'react';
import { RouteNames } from '../../constants';
import { tabRepository } from '../../repositories';
import { TabListParameters } from '../../types';
import { ActionType } from '../action-type';
import { AppAction } from '../app-action';

export const loadHomeTabs = async (params: TabListParameters, dispatch: Dispatch<AppAction>) => {
  dispatch({
    type: ActionType.fetchTabsStart,
    params,
    route: RouteNames.home,
  });

  const response = await tabRepository.getPublicTabs(params);

  dispatch({
    type: ActionType.fetchTabsEnd,
    response,
    route: RouteNames.home,
  });
};
