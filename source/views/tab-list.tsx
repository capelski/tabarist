import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { TextFilter } from '../components';
import { createTab } from '../components/commons';
import { Modal } from '../components/modal';
import { addSymbol, removeSymbol } from '../constants';
import { User } from '../firebase';
import { getTabRelativeUrl } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type TabListViewProps = {
  getTabs: (titleFilter: string) => Promise<Tab[]>;
  user: User | null;
};

export const TabListView: React.FC<TabListViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [titleFilter, setTitleFilter] = useState('');

  const navigate = useNavigate();

  const updateTabs = async () => {
    setLoading(true);

    const tabs = await props.getTabs(titleFilter);

    setTabs(tabs);
    setLoading(false);
  };

  useEffect(() => {
    updateTabs();
  }, [props.user, titleFilter]);

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const confirmDelete = async () => {
    if (!props.user) {
      return;
    }

    await tabRepository.remove(deletingTab);
    updateTabs();
    cancelDelete();
  };

  const removeTab = (tabId: string) => {
    setDeletingTab(tabId);
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
        <TextFilter text={titleFilter} textSetter={setTitleFilter} />

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

      {loading ? (
        <p>Loading...</p>
      ) : tabs.length === 0 ? (
        <p>No tabs to display{!props.user && <span>. Sign in to create your own tabs</span>}</p>
      ) : (
        tabs.map((tab) => {
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
  );
};
