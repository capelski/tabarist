import React, { useContext, useEffect } from 'react';
import { ItemsList, ItemsListProps, TabListItem } from '../components';
import { getStarredListRelativeUrl } from '../operations';
import { starredTabRepository } from '../repositories';
import { ActionType, StateProvider } from '../state';
import { StarredListParameters, StarredTab } from '../types';
import { MetaTags } from './common/meta-tags';

export const StarredTabsView: React.FC = () => {
  const { dispatch, state } = useContext(StateProvider);

  const listState = state.starredTabs;

  const fetchTabs = async () => {
    if (!state.user.document) {
      return;
    }

    dispatch({ type: ActionType.fetchStarredTabsStart });
    const response = await starredTabRepository.getMany(state.user.document.uid, listState.params);
    dispatch({
      type: ActionType.fetchStarredTabsEnd,
      navigate: listState.skipUrlUpdate
        ? undefined
        : {
            to: [getStarredListRelativeUrl(listState.params)],
          },
      response,
    });
  };

  useEffect(() => {
    if (state.user.document && state.searchParamsReady && !listState.data && !listState.loading) {
      fetchTabs();
    }
  }, [listState, state.searchParamsReady, state.user.document]);

  const listProps: ItemsListProps<StarredTab, StarredListParameters> = {
    getNavigationUrl: getStarredListRelativeUrl,
    itemRenderer: (starredTab) => (
      <TabListItem
        allowRemoving={true}
        key={starredTab.id}
        remove={async () => {
          if (!state.user.document) {
            return;
          }

          await starredTabRepository.remove(starredTab.id);
          dispatch({
            type: ActionType.setStarredListParameters,
            params: listState.params,
          });
        }}
        tab={starredTab}
      />
    ),
    listState,
    loadPage: (nextParams) => {
      dispatch({ type: ActionType.setStarredListParameters, params: nextParams });
    },
    noDocuments: <p style={{ textAlign: 'center' }}>You don't have starred tabs</p>,
  };

  return (
    <React.Fragment>
      <MetaTags title="Tabarist - Starred tabs" />

      <ItemsList {...listProps} />
    </React.Fragment>
  );
};
