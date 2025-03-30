import React from 'react';
import { NavLink } from 'react-router';
import { removeSymbol } from '../../constants';
import { getTabRelativeUrl } from '../../operations';
import { Tab } from '../../types';

export type TabListItemProps = {
  isTabOwner: boolean;
  startRemoveTab: () => void;
  tab: Tab;
};

export const TabListItem: React.FC<TabListItemProps> = (props) => {
  return (
    <div
      key={props.tab.id}
      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
    >
      <NavLink className="nav-link" style={{ flexGrow: 1 }} to={getTabRelativeUrl(props.tab.id)}>
        {props.tab.title}
      </NavLink>
      {props.isTabOwner && (
        <div>
          <button className="btn btn-outline-danger" onClick={props.startRemoveTab} type="button">
            {removeSymbol}
          </button>
        </div>
      )}
    </div>
  );
};
