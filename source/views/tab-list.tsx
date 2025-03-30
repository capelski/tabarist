import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { NavLink, useSearchParams } from 'react-router';
import { TabDeletionModal, TextFilter } from '../components';
import { queryParameters, removeSymbol } from '../constants';
import { getTabRelativeUrl } from '../operations';
import { AnchorDirection, TabPageResponse, TabQueryParameters } from '../types';

export type TabListBaseProps = {
  createTab: () => void;
  user: User | null;
};

export type TabListViewProps = TabListBaseProps & {
  getTabs: (params?: TabQueryParameters) => Promise<TabPageResponse>;
};

export const TabListView: React.FC<TabListViewProps> = (props) => {
  const [deletingTabId, setDeletingTabId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tabPageResponse, setTabPageResponse] = useState<TabPageResponse>({
    hasNextPage: false,
    hasPreviousPage: false,
    tabs: [],
  });
  const [tabParams, setTabParams] = useState<TabQueryParameters>();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const titleParameter = searchParams.get(queryParameters.title);
    const aDParameter = searchParams.get(queryParameters.anchorDirection);
    const aIParameter = searchParams.get(queryParameters.anchorId);
    const aTParameter = searchParams.get(queryParameters.anchorTitle);

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
      nextSearchParams.set(queryParameters.anchorDirection, params.anchorDocument.direction);
      nextSearchParams.set(queryParameters.anchorId, params.anchorDocument.id);
      nextSearchParams.set(queryParameters.anchorTitle, params.anchorDocument.title);
      setSearchParams(nextSearchParams);
    }

    setLoading(false);
    setTabPageResponse(response);
  };

  useEffect(() => {
    updateTabs(tabParams);
  }, [props.user, tabParams]);

  const cancelDelete = () => {
    setDeletingTabId('');
  };

  const removeTab = (tabId: string) => {
    setDeletingTabId(tabId);
  };

  const updateTitleFilter = (nextTitleFilter: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextTitleFilter) {
      nextSearchParams.set(queryParameters.title, nextTitleFilter);
    } else {
      nextSearchParams.delete(queryParameters.title);
    }
    nextSearchParams.delete(queryParameters.anchorDirection);
    nextSearchParams.delete(queryParameters.anchorId);
    nextSearchParams.delete(queryParameters.anchorTitle);

    const nextParams = { titleFilter: nextTitleFilter };
    setTabParams(nextParams);
    setSearchParams(nextSearchParams);
  };

  return (
    <div className="tabs">
      <TabDeletionModal
        afterDeletion={() => {
          updateTabs(tabParams);
        }}
        cancelDelete={cancelDelete}
        tabId={deletingTabId}
      />

      <p>
        <TextFilter text={tabParams?.titleFilter ?? ''} textSetter={updateTitleFilter} />
      </p>

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
          No tabs to display. Create your first tab by clicking on{' '}
          <a onClick={props.createTab} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
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
              const isTabOwner = props.user && props.user.uid === tab.ownerId;

              return (
                <div
                  key={tab.id}
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
                >
                  <div>
                    {tab.title}
                    <NavLink style={{ marginLeft: 8 }} to={getTabRelativeUrl(tab.id)}>
                      ➡️
                    </NavLink>
                  </div>
                  {isTabOwner && (
                    <div>
                      <button onClick={() => removeTab(tab.id)} type="button">
                        {removeSymbol}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
