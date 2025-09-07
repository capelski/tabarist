import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { RouteNames } from '../../constants';
import { getTabListRelativeUrl } from '../../operations';
import { ActionType, ListState, StateProvider } from '../../state';
import { Tab, TabListParameters } from '../../types';
import { ItemsList, ItemsListProps } from '../common/items-list';
import { TextFilter } from '../common/text-filter';
import { TabListItem } from './tab-list-item';
import { createNewTab } from './tab-utils';

export type TabListProps = {
  listState: ListState<Tab, TabListParameters>;
  route: RouteNames.allTabs | RouteNames.myTabs;
  user: User | null;
};

export const TabList: React.FC<TabListProps> = (props) => {
  const { dispatch, state } = useContext(StateProvider);
  const navigate = useNavigate();

  const removeTab = (tab: Tab) => {
    dispatch({ type: ActionType.deletePrompt, route: props.route, tab });
  };

  const listProps: ItemsListProps<Tab, TabListParameters> = {
    getNavigationUrl: (params) => getTabListRelativeUrl(props.route, params),
    itemRenderer: (tab) => (
      <TabListItem
        allowRemoving={!!props.user && props.user.uid === tab.ownerId}
        key={tab.id}
        remove={() => removeTab(tab)}
        route={props.route}
        tab={tab}
      />
    ),
    listState: props.listState,
    noDocuments: (
      <p style={{ textAlign: 'center' }}>
        No tabs to display. Create a tab by clicking on{' '}
        <a
          onClick={() => {
            createNewTab(state, dispatch, navigate);
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
      <TextFilter
        initialValue={props.listState.params.titleFilter ?? ''}
        update={(titleFilter) => {
          navigate(getTabListRelativeUrl(props.route, { titleFilter }));
        }}
      />

      <ItemsList {...listProps} />
    </div>
  );
};
