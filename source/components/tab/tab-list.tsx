import { User } from 'firebase/auth';
import React, { useContext } from 'react';
import { RouteNames } from '../../constants';
import { ActionType, DispatchProvider, TabListState } from '../../state';
import { Tab, TabQueryParameters } from '../../types';
import { TextFilter } from '../common/text-filter';
import { TabDeletionModal } from './tab-deletion-modal';
import { TabListItem } from './tab-list-item';

export type TabListBaseProps = {
  deletingTab?: Tab;
  listState: TabListState;
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

      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.hasPreviousPage}
          onClick={() => {
            const firstTab = props.listState.data!.tabs[0];
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
          type="button"
        >
          ⏪️
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!props.listState.data?.hasNextPage}
          onClick={() => {
            const lastTab = props.listState.data!.tabs[props.listState.data!.tabs.length - 1];
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
          type="button"
        >
          ⏩
        </button>
      </p>

      {!props.listState.data ? (
        <p>Loading...</p>
      ) : props.listState.data.tabs.length === 0 ? (
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
      ) : (
        <div>
          {props.listState.data.tabs.map((tab) => {
            return (
              <TabListItem
                isTabOwner={!!props.user && props.user.uid === tab.ownerId}
                key={tab.id}
                startRemoveTab={() => removeTab(tab)}
                tab={tab}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
