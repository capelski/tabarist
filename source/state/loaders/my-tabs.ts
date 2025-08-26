import { Dispatch } from 'react';
import { RouteNames } from '../../constants';
import { tabRepository } from '../../repositories';
import { TabListParameters } from '../../types';
import { ActionType } from '../action-type';
import { AppAction } from '../app-action';

export const loadMyTabs = async (
  userId: string,
  params: TabListParameters,
  dispatch: Dispatch<AppAction>,
) => {
  dispatch({
    type: ActionType.fetchTabsStart,
    params,
    route: RouteNames.myTabs,
  });

  const response = await tabRepository.getUserTabs(userId, params);

  dispatch({
    type: ActionType.fetchTabsEnd,
    response,
    route: RouteNames.myTabs,
  });
};
