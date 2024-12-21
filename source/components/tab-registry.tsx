import React from 'react';
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
  const navigate = useNavigate();

  return (
    <div className="tab-registry">
      <p>
        <button
          onClick={() => {
            const tabId = props.createTab();
            navigate(getTabRelativeUrl(tabId));
          }}
          type="button"
        >
          {addSymbol} Create tab
        </button>
      </p>
      {Object.entries(props.tabRegistry).map(([id, title]) => {
        return (
          <div
            key={id}
            style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
          >
            <span>{title}</span>
            <div>
              <NavLink style={{ marginRight: 8 }} to={getTabRelativeUrl(id)}>
                ➡️
              </NavLink>
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
