import React from 'react';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';

export type TabDetailsProps = {
  isEditMode: boolean;
  isTabOwner: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const TabDetails: React.FC<TabDetailsProps> = (props) => {
  return (
    <div className="tab-details">
      {(props.isEditMode || props.tab.capo) && (
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Capo: </span>
          {props.isEditMode ? (
            <input
              onChange={(event) => {
                const nextCapo = parseInt(event.target.value);
                const nextTab = tabOperations.updateCapo(
                  props.tab,
                  isNaN(nextCapo) ? undefined : nextCapo,
                );
                props.updateTab(nextTab);
              }}
              type="number"
              value={props.tab.capo ?? ''}
            />
          ) : (
            <span>{props.tab.capo}</span>
          )}
        </div>
      )}

      {(props.isEditMode || props.tab.backingTrack) && (
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 8 }}>
          <span style={{ marginRight: 8 }}>Backing track: </span>
          {props.isEditMode ? (
            <input
              onChange={(event) => {
                const nextTab = tabOperations.updateBackingTrack(props.tab, event.target.value);
                props.updateTab(nextTab);
              }}
              style={{ flexGrow: 1 }}
              value={props.tab.backingTrack ?? ''}
            />
          ) : (
            <a href={props.tab.backingTrack} style={{ flexGrow: 1 }} target="_blank">
              {props.tab.backingTrack}
            </a>
          )}
        </div>
      )}
    </div>
  );
};
