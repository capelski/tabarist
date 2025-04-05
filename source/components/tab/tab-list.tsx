import { User } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { QueryParameters } from '../../constants';
import { ActionType, DispatchProvider } from '../../state';
import { AnchorDirection, Tab, TabPageResponse, TabQueryParameters } from '../../types';
import { TextFilter } from '../common/text-filter';
import { TabDeletionModal } from './tab-deletion-modal';
import { TabListItem } from './tab-list-item';

export type TabListBaseProps = {
  deletingTab?: Tab;
  user: User | null;
};

export type TabListProps = TabListBaseProps & {
  getTabs: (params?: TabQueryParameters) => Promise<TabPageResponse>;
};

export const TabList: React.FC<TabListProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [tabPageResponse, setTabPageResponse] = useState<TabPageResponse>({
    hasNextPage: false,
    hasPreviousPage: false,
    tabs: [],
  });
  const [tabParams, setTabParams] = useState<TabQueryParameters>();

  const dispatch = useContext(DispatchProvider);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const titleParameter = searchParams.get(QueryParameters.title);
    const aDParameter = searchParams.get(QueryParameters.anchorDirection);
    const aIParameter = searchParams.get(QueryParameters.anchorId);
    const aTParameter = searchParams.get(QueryParameters.anchorTitle);

    const nextTabParams: TabQueryParameters = {};

    if (titleParameter) {
      nextTabParams.titleFilter = titleParameter;
    }

    if (aDParameter && aIParameter && aTParameter) {
      nextTabParams.anchorDocument = {
        direction: aDParameter as AnchorDirection,
        id: aIParameter,
        title: aTParameter,
      };
    }

    setTabParams(nextTabParams);
  }, []);

  const updateTabs = async (params?: TabQueryParameters) => {
    setLoading(true);

    const response = await props.getTabs(params);

    if (params?.anchorDocument) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set(QueryParameters.anchorDirection, params.anchorDocument.direction);
      nextSearchParams.set(QueryParameters.anchorId, params.anchorDocument.id);
      nextSearchParams.set(QueryParameters.anchorTitle, params.anchorDocument.title);
      setSearchParams(nextSearchParams);
    }

    setLoading(false);
    setTabPageResponse(response);
  };

  useEffect(() => {
    if (props.user || tabParams) {
      updateTabs(tabParams);
    }
  }, [props.user, tabParams]);

  const removeTab = (tab: Tab) => {
    dispatch({ type: ActionType.deletePrompt, tab });
  };

  const updateTitleFilter = (nextTitleFilter: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextTitleFilter) {
      nextSearchParams.set(QueryParameters.title, nextTitleFilter);
    } else {
      nextSearchParams.delete(QueryParameters.title);
    }
    nextSearchParams.delete(QueryParameters.anchorDirection);
    nextSearchParams.delete(QueryParameters.anchorId);
    nextSearchParams.delete(QueryParameters.anchorTitle);

    const nextParams = { titleFilter: nextTitleFilter };
    setTabParams(nextParams);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tabs">
      <TabDeletionModal
        deletingTab={props.deletingTab}
        onTabDeleted={() => {
          dispatch({ type: ActionType.deleteConfirm });
          updateTabs(tabParams);
        }}
      />

      <TextFilter text={tabParams?.titleFilter ?? ''} textSetter={updateTitleFilter} />

      <p style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn btn-outline-secondary"
          disabled={!tabPageResponse.hasPreviousPage}
          onClick={() => {
            const firstTab = tabPageResponse.tabs[0];
            const nextTabParams: TabQueryParameters = {
              ...tabParams,
              anchorDocument: {
                direction: 'previous',
                id: firstTab.id,
                title: firstTab.title,
              },
            };

            setTabParams(nextTabParams);
          }}
          style={{ marginRight: 8 }}
          type="button"
        >
          ⏪️
        </button>
        <button
          className="btn btn-outline-secondary"
          disabled={!tabPageResponse.hasNextPage}
          onClick={() => {
            const lastTab = tabPageResponse.tabs[tabPageResponse.tabs.length - 1];
            const nextTabParams: TabQueryParameters = {
              ...tabParams,
              anchorDocument: {
                direction: 'next',
                id: lastTab.id,
                title: lastTab.title,
              },
            };

            setTabParams(nextTabParams);
          }}
          type="button"
        >
          ⏩
        </button>
      </p>

      {tabPageResponse.tabs.length === 0 && !loading ? (
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
          {loading ? (
            <p>Loading...</p>
          ) : (
            tabPageResponse.tabs.map((tab) => {
              return (
                <TabListItem
                  isTabOwner={!!props.user && props.user.uid === tab.ownerId}
                  key={tab.id}
                  startRemoveTab={() => removeTab(tab)}
                  tab={tab}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
