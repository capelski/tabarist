import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { addSymbol, removeSymbol } from '../constants';
import { getTabRelativeUrl } from '../logic';
import { TabRegistry } from '../types';

export type TabRegistryProps = {
  createTab: () => string;
  removeTab: (tabId: string) => void;
  tabRegistry: TabRegistry;
  tabRegistrySetter: (tabRegistry: TabRegistry) => void;
};

export const TabRegistryComponent: React.FC<TabRegistryProps> = (props) => {
  const [filter, setFilter] = useState('');

  const navigate = useNavigate();

  return (
    <div className="tab-registry">
      <p>
        <button
          onClick={() => {
            const tabId = props.createTab();
            navigate(getTabRelativeUrl(tabId, true));
          }}
          style={{ marginRight: 16 }}
          type="button"
        >
          {addSymbol} Create tab
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
        .filter(([_, title]) => {
          return title.toLowerCase().includes(filter.toLocaleLowerCase());
        })
        .map(([id, title]) => {
          return (
            <div
              key={id}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
            >
              <div>
                {title}
                <NavLink style={{ marginLeft: 8 }} to={getTabRelativeUrl(id)}>
                  ➡️
                </NavLink>
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
