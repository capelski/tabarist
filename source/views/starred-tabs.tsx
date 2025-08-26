import React, { useContext } from 'react';
import { ItemsList, ItemsListProps, TabListItem } from '../components';
import { getStarredListRelativeUrl } from '../operations';
import { starredTabRepository } from '../repositories';
import { loadStarredTabs, StateProvider } from '../state';
import { StarredListParameters, StarredTab } from '../types';
import { MetaTags } from './common/meta-tags';

export const StarredTabsView: React.FC = () => {
  const { dispatch, state } = useContext(StateProvider);

  const listState = state.starredTabs;

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
          await loadStarredTabs(state.user.document.uid, listState.params, dispatch);
        }}
        tab={starredTab}
      />
    ),
    listState,
    noDocuments: <p style={{ textAlign: 'center' }}>You don't have starred tabs</p>,
  };

  return (
    <React.Fragment>
      <MetaTags title="Tabarist - Starred tabs" />

      <ItemsList {...listProps} />
    </React.Fragment>
  );
};
