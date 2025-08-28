import { Dispatch } from 'react';
import { starredTabRepository, tabRepository } from '../../repositories';
import { StarredTab } from '../../types';
import { ActionType } from '../action-type';
import { AppAction } from '../app-action';

export const loadTabDetails = async (
  tabId: string,
  userId: string | undefined,
  dispatch: Dispatch<AppAction>,
) => {
  dispatch({
    type: ActionType.fetchTabDetailsStart,
  });

  const tab = await tabRepository.getById(tabId);

  let starredTab: StarredTab | undefined;
  if (tab && userId) {
    starredTab = await starredTabRepository.getOne(userId, tabId);

    // The title in the starred tab might have gone outdated; update it now if necessary
    if (starredTab && starredTab.title !== tab.title) {
      starredTab.title = tab.title;
      await starredTabRepository.update(starredTab);
    }
  }

  dispatch({
    type: ActionType.fetchTabDetailsEnd,
    starredTabId: starredTab?.id,
    tab,
  });
};
