import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { addSymbol, removeSymbol } from '../constants';
import { getTabRelativeUrl } from '../operations';
import { Tab, TabRegistry } from '../types';

export type TabRegistryProps = {
  createTab: () => Promise<Tab>;
  removeTab: (tabId: string) => void;
  tabRegistry: TabRegistry;
};

export const TabRegistryView: React.FC<TabRegistryProps> = (props) => {
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();

  const createTab = async () => {
    const tab = await props.createTab();
    navigate(getTabRelativeUrl(tab.id, true));
  };

  return (
    <div className="tab-registry">
      <p>
        <button onClick={createTab} style={{ marginRight: 16 }} type="button">
          {addSymbol} tab
        </button>

        <span style={{ marginRight: 8 }}>🔎</span>
        <input
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          value={filter}
        />
        {filter && (
          <span onClick={() => setFilter('')} style={{ cursor: 'pointer', marginLeft: 8 }}>
            ❌
          </span>
        )}
      </p>
      {Object.entries(props.tabRegistry)
        .filter(([_, { title }]) => {
          return title.toLowerCase().includes(filter.toLocaleLowerCase());
        })
        .map(([id, record]) => {
          return (
            <div
              key={id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
            >
              <div>
                {record.title}
                <NavLink style={{ marginLeft: 8 }} to={getTabRelativeUrl(id)}>
                  ➡️
                </NavLink>
                {WEBPACK_USE_FIREBASE && (
                  <span style={{ marginLeft: 8 }}>
                    {!record.synced ? '📵' : record.hasUnsyncedChange ? '⌛️' : '🛜'}
                  </span>
                )}
              </div>
              <div>
                <button onClick={() => props.removeTab(id)} type="button">
                  {removeSymbol}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};
