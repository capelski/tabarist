import React, { useContext } from 'react';
import { NavLink } from 'react-router';
import { removeSymbol } from '../../constants';
import { getTabRelativeUrl } from '../../operations';
import { ActionType, StateProvider } from '../../state';
import { StarredTab, Tab } from '../../types';

export type TabListItemProps = {
  allowRemoving: boolean;
  remove: () => void;
  tab: StarredTab | Tab;
};

export const TabListItem: React.FC<TabListItemProps> = (props) => {
  const { dispatch } = useContext(StateProvider);

  return (
    <div
      key={props.tab.id}
      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
    >
      <NavLink
        className="nav-link"
        style={{ flexGrow: 1 }}
        onClick={() => {
          if ('bars' in props.tab) {
            // Set the tab here to prevent a redundant network query
            dispatch({ type: ActionType.setTab, tab: props.tab });
          }
        }}
        to={getTabRelativeUrl(props.tab.id)}
      >
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
