import React, { useContext, useEffect } from 'react';
import { TabListItem } from '../components';
import { ItemsList } from '../components/common/items-list';
import { getStarredListRelativeUrl } from '../operations';
import { userRepository } from '../repositories';
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
    const response = await userRepository.getStarredTabs(state.user.document.uid, listState.params);
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

  return (
    <React.Fragment>
      <MetaTags title="Tabarist - Starred tabs" />

      <ItemsList
        itemRenderer={(tab: StarredTab) => {
          return (
            <TabListItem
              allowRemoving={true}
              key={tab.id}
              remove={async () => {
                if (!state.user.document) {
                  return;
                }

                await userRepository.removeStarredTab(state.user.document.uid, tab.id);
                dispatch({
                  type: ActionType.setStarredListParameters,
                  params: listState.params,
                });
              }}
              tab={tab}
            />
          );
        }}
        listState={listState}
        loadNext={() => {
          const lastTab = listState.data!.documents[listState.data!.documents.length - 1];
          const nextParams: StarredListParameters = {
            anchorDocument: {
              direction: 'next',
              id: lastTab.id,
            },
          };

          dispatch({ type: ActionType.setStarredListParameters, params: nextParams });
        }}
        loadPrevious={() => {
          const firstTab = listState.data!.documents[0];
          const nextParams: StarredListParameters = {
            anchorDocument: {
              direction: 'previous',
              id: firstTab.id,
            },
          };

          dispatch({ type: ActionType.setStarredListParameters, params: nextParams });
        }}
        noDocuments={<p style={{ textAlign: 'center' }}>You don't have starred tabs</p>}
      />
    </React.Fragment>
  );
};
