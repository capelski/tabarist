import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { RouteNames } from '../../constants';
import { ActionType, DispatchProvider, ListState } from '../../state';
import { Tab, TabQueryParameters } from '../../types';
import { ItemsList } from '../common/items-list';
import { TextFilter } from '../common/text-filter';
import { TabDeletionModal } from './tab-deletion-modal';
import { TabListItem } from './tab-list-item';

export type TabListBaseProps = {
  deletingTab?: Tab;
  listState: ListState<Tab, TabQueryParameters>;
  user: User | null;
};

export type TabListProps = TabListBaseProps & {
  route: RouteNames.home | RouteNames.myTabs;
};

export const TabList: React.FC<TabListProps> = (props) => {
  const dispatch = useContext(DispatchProvider);

  const removeTab = (tab: Tab) => {
    dispatch({ type: ActionType.deletePrompt, tab });
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

      <ItemsList
        itemRenderer={(tab: Tab) => {
          return (
            <TabListItem
              isTabOwner={!!props.user && props.user.uid === tab.ownerId}
              key={tab.id}
              startRemoveTab={() => removeTab(tab)}
              tab={tab}
            />
          );
        }}
        listState={props.listState}
        loadNext={() => {
          const lastTab =
            props.listState.data!.documents[props.listState.data!.documents.length - 1];
          const nextParams: TabQueryParameters = {
            ...props.listState.params,
            anchorDocument: {
              direction: 'next',
              id: lastTab.id,
              title: lastTab.title,
            },
          };

          dispatch({ type: ActionType.setTabListParams, params: nextParams, route: props.route });
        }}
        loadPrevious={() => {
          const firstTab = props.listState.data!.documents[0];
          const nextParams: TabQueryParameters = {
            ...props.listState.params,
            anchorDocument: {
              direction: 'previous',
              id: firstTab.id,
              title: firstTab.title,
            },
          };

          dispatch({ type: ActionType.setTabListParams, params: nextParams, route: props.route });
        }}
        noDocuments={
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
        }
      />
    </div>
  );
};
