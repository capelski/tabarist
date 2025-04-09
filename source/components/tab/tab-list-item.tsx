import React from 'react';
import { NavLink } from 'react-router';
import { removeSymbol } from '../../constants';
import { getTabRelativeUrl } from '../../operations';
import { StarredTab } from '../../types';

export type TabListItemProps = {
  allowRemoving: boolean;
  remove: () => void;
  tab: StarredTab;
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
