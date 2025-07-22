import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { RouteNames } from '../../constants';
import { getTabListRelativeUrl } from '../../operations';
import { ActionType, ListState, StateProvider } from '../../state';
import { Tab, TabListParameters } from '../../types';
import { ItemsList, ItemsListProps } from '../common/items-list';
import { TextFilter } from '../common/text-filter';
import { TabDeletionModal } from './tab-deletion-modal';
import { TabListItem } from './tab-list-item';

export type TabListBaseProps = {
  deletingTab?: Tab;
  listState: ListState<Tab, TabListParameters>;
  user: User | null;
};

export type TabListProps = TabListBaseProps & {
  route: RouteNames.home | RouteNames.myTabs;
};

export const TabList: React.FC<TabListProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  const removeTab = (tab: Tab) => {
    dispatch({ type: ActionType.deletePrompt, tab });
  };

  const listProps: ItemsListProps<Tab, TabListParameters> = {
    getNavigationUrl: (params) => getTabListRelativeUrl(props.route, params),
    itemRenderer: (tab) => (
      <TabListItem
        allowRemoving={!!props.user && props.user.uid === tab.ownerId}
        key={tab.id}
        remove={() => removeTab(tab)}
        tab={tab}
      />
    ),
    listState: props.listState,
    loadPage: (nextParams) => {
      dispatch({ type: ActionType.setTabListParams, params: nextParams, route: props.route });
    },
    noDocuments: (
      <p style={{ textAlign: 'center' }}>
        No tabs to display. Create a tab by clicking on{' '}
        <a
          onClick={() => {
            dispatch({ type: ActionType.createTab });
          }}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
        >
          New tab
        </a>
        .
      </p>
    ),
  };

  return (
    <div className="tabs">
      <TabDeletionModal
        deletingTab={props.deletingTab}
        onTabDeleted={() => {
          dispatch({
            type: ActionType.setTabListParams,
            params: props.listState.params,
            route: props.route,
          });
        }}
      />

      <TextFilter
        initialValue={props.listState.params.titleFilter ?? ''}
        update={(titleFilter) => {
          dispatch({
            type: ActionType.setTabListParams,
            params: { titleFilter },
            route: props.route,
          });
        }}
      />

      <ItemsList {...listProps} />
    </div>
  );
};
