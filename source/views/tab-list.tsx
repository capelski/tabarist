import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router';
import { TextFilter } from '../components';
import { createTab } from '../components/commons';
import { Modal } from '../components/modal';
import { addSymbol, queryParameters, removeSymbol } from '../constants';
import { User } from '../firebase';
import { getTabRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { TabPageResponse, TabQueryParameters } from '../repositories/tab.repository-interface';
import { Tab } from '../types';

export type TabListViewProps = {
  getTabs: (params?: TabQueryParameters) => Promise<TabPageResponse>;
  user: User | null;
};

export const TabListView: React.FC<TabListViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [isLastPage, setIsLastPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [titleFilter, setTitleFilter] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const titleParameter = searchParams.get(queryParameters.title);
    if (titleParameter) {
      setTitleFilter(titleParameter);
    }
  }, []);

  const updateTabs = async (params?: TabQueryParameters) => {
    setLoading(true);

    const response = await props.getTabs(params);
    const keepPreviousTabs = !!params?.lastDocument;

    setIsLastPage(response.isLastPage);
    setLoading(false);
    setTabs(keepPreviousTabs ? [...tabs, ...response.tabs] : response.tabs);
  };

  useEffect(() => {
    updateTabs({ titleFilter });
  }, [props.user]);

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const confirmDelete = async () => {
    if (!props.user) {
      return;
    }

    await tabRepository.remove(deletingTab);
    setTabs(tabs.filter((tab) => tab.id !== deletingTab));
    cancelDelete();
  };

  const removeTab = (tabId: string) => {
    setDeletingTab(tabId);
  };

  const updateTitleFilter = (nextTitleFilter: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (nextTitleFilter) {
      nextSearchParams.set(queryParameters.title, nextTitleFilter);
    } else {
      nextSearchParams.delete(queryParameters.title);
    }
    setTitleFilter(nextTitleFilter);
    setSearchParams(nextSearchParams);
    updateTabs({ titleFilter: nextTitleFilter });
  };

  return (
    <div className="tabs">
      {deletingTab && (
        <Modal closeHandler={cancelDelete}>
          <p>Are you sure you want to delete this tab?</p>
          <div>
            <button onClick={confirmDelete} style={{ marginRight: 8 }} type="button">
              Delete
            </button>
            <button onClick={cancelDelete} type="button">
              Cancel
            </button>
          </div>
        </Modal>
      )}

      <p>
        <TextFilter text={titleFilter} textSetter={updateTitleFilter} />

        {props.user && (
          <button
            onClick={() => createTab(props.user!, navigate)}
            style={{ marginLeft: 16 }}
            type="button"
          >
            {addSymbol} tab
          </button>
        )}
      </p>

      {tabs.length === 0 && !loading ? (
        <p>No tabs to display{!props.user && <span>. Sign in to create your own tabs</span>}</p>
      ) : (
        <div>
          {tabs.map((tab) => {
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
          })}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <button
              disabled={isLastPage}
              onClick={() => {
                const lastTab = tabs[tabs.length - 1];
                updateTabs({
                  titleFilter,
                  lastDocument: {
                    id: lastTab.id,
                    title: lastTab.title,
                  },
                });
              }}
              type="button"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
};
