import { User } from 'firebase/auth';
import React, { useContext, useEffect } from 'react';
import { TabListItem } from '../components';
import { ItemsList } from '../components/common/items-list';
import { getStarredListRelativeUrl } from '../operations';
import { userRepository } from '../repositories';
import { ActionType, ListState, StateProvider } from '../state';
import { StarredListParameters, StarredTab } from '../types';
import { MetaTags } from './common/meta-tags';

export type StarredTabsViewProps = {
  listState: ListState<StarredTab, StarredListParameters>;
  searchParamsReady: boolean;
  user: User | null;
};

export const StarredTabsView: React.FC<StarredTabsViewProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const fetchTabs = async () => {
    if (!props.user) {
      return;
    }

    dispatch({ type: ActionType.fetchStarredTabsStart });
    const response = await userRepository.getStarredTabs(props.user.uid, props.listState.params);
    dispatch({
      type: ActionType.fetchStarredTabsEnd,
      navigate: props.listState.skipUrlUpdate
        ? undefined
        : {
            to: [getStarredListRelativeUrl(props.listState.params)],
          },
      response,
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
      <MetaTags title="Tabarist - Starred tabs" />

      <ItemsList
        itemRenderer={(tab: StarredTab) => {
          return (
            <TabListItem
              allowRemoving={true}
              key={tab.id}
              remove={async () => {
                if (!props.user) {
                  return;
                }

                await userRepository.removeStarredTab(props.user.uid, tab.id);
                dispatch({
                  type: ActionType.setStarredListParameters,
                  params: props.listState.params,
                });
              }}
              tab={tab}
            />
          );
        }}
        listState={props.listState}
        loadNext={() => {
          const lastTab =
            props.listState.data!.documents[props.listState.data!.documents.length - 1];
          const nextParams: StarredListParameters = {
            anchorDocument: {
              direction: 'next',
              id: lastTab.id,
            },
          };

          dispatch({ type: ActionType.setStarredListParameters, params: nextParams });
        }}
        loadPrevious={() => {
          const firstTab = props.listState.data!.documents[0];
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
