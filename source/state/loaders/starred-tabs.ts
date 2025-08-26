import { Dispatch } from 'react';
import { starredTabRepository } from '../../repositories';
import { StarredListParameters } from '../../types';
import { ActionType } from '../action-type';
import { AppAction } from '../app-action';

export const loadStarredTabs = async (
  userId: string,
  params: StarredListParameters,
  dispatch: Dispatch<AppAction>,
) => {
  dispatch({
    type: ActionType.fetchStarredTabsStart,
    params,
  });

  const response = await starredTabRepository.getMany(userId, params);

  dispatch({
    type: ActionType.fetchStarredTabsEnd,
    response,
  });
};
