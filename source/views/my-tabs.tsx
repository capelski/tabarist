import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { TextFilter } from '../components';
import { addSymbol, removeSymbol } from '../constants';
import { User } from '../firebase';
import { getTabRelativeUrl, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Tab } from '../types';

export type MyTabsViewProps = {
  user: User | null;
};

export const MyTabsView: React.FC<MyTabsViewProps> = (props) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [titleFilter, setTitleFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      tabRepository.getUserTabs(props.user.uid, titleFilter).then(setTabs);
    }
  }, [props.user, titleFilter]);

  const createTab = async () => {
    if (!props.user) {
      return;
    }

    const tab = tabOperations.create(props.user.uid);
    await tabRepository.set(tab, props.user.uid);

    navigate(getTabRelativeUrl(tab.id, true));
  };

  const removeTab = async (tabId: string) => {
    if (!props.user) {
      return;
    }

    await tabRepository.remove(tabId);
    const nextTabs = await tabRepository.getUserTabs(props.user.uid, titleFilter);
    setTabs(nextTabs);
  };

  return (
    <div className="tab-registry">
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
