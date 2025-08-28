import React from 'react';
import { NavLink } from 'react-router';
import { removeSymbol } from '../../constants';
import { getTabRelativeUrl } from '../../operations';
import { StarredTab, Tab } from '../../types';

export type TabListItemProps = {
  allowRemoving: boolean;
  remove: () => void;
  tab: StarredTab | Tab;
};

export const TabListItem: React.FC<TabListItemProps> = (props) => {
  const tabId = 'bars' in props.tab ? props.tab.id : props.tab.tabId;

  return (
    <div key={tabId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <NavLink className="nav-link" style={{ flexGrow: 1 }} to={getTabRelativeUrl(tabId)}>
        {props.tab.title}
      </NavLink>
      {props.allowRemoving && (
        <div>
          <button className="btn btn-outline-danger" onClick={props.remove} type="button">
            {removeSymbol}
          </button>
        </div>
      )}
    </div>
  );
};
