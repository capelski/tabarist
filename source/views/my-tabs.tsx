import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { TextFilter } from '../components';
import { Modal } from '../components/modal';
import { addSymbol, removeSymbol } from '../constants';
import { User } from '../firebase';
import { getTabRelativeUrl, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type MyTabsViewProps = {
  user: User | null;
};

export const MyTabsView: React.FC<MyTabsViewProps> = (props) => {
  const [deletingTab, setDeletingTab] = useState('');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [titleFilter, setTitleFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      tabRepository.getUserTabs(props.user.uid, titleFilter).then(setTabs);
    }
  }, [props.user, titleFilter]);

  const cancelDelete = () => {
    setDeletingTab('');
  };

  const confirmDelete = async () => {
    if (!props.user) {
      return;
    }

    await tabRepository.remove(deletingTab);
    const nextTabs = await tabRepository.getUserTabs(props.user.uid, titleFilter);
    setTabs(nextTabs);
    cancelDelete();
  };

  const createTab = async () => {
    if (!props.user) {
      return;
    }

    const tab = tabOperations.create(props.user.uid);
    await tabRepository.set(tab, props.user.uid);

    navigate(getTabRelativeUrl(tab.id, true));
  };

  const removeTab = (tabId: string) => {
    setDeletingTab(tabId);
  };

  return (
    <div className="tab-registry">
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
          <button onClick={createTab} style={{ marginLeft: 16 }} type="button">
            {addSymbol} tab
          </button>
        )}
      </p>

      {!props.user ? (
        <p>Sign in to create your own tabs</p>
      ) : (
        tabs.length === 0 && <p>No tabs to display</p>
      )}

      {tabs.map((tab) => {
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
            <div>
              <button onClick={() => removeTab(tab.id)} type="button">
                {removeSymbol}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
