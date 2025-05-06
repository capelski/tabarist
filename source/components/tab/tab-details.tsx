import React from 'react';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';

export type TabDetailsProps = {
  isEditMode: boolean | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const TabDetails: React.FC<TabDetailsProps> = (props) => {
  const openBackingTrack = () => {
    if (props.isEditMode) {
      return;
    }

    window.open(props.tab.backingTrack);
  };

  return (
    <div className="tab-details">
      {(props.isEditMode || props.tab.backingTrack) && (
        <div className="input-group mb-2">
          <span
            className="input-group-text"
            onClick={openBackingTrack}
            style={{ cursor: props.isEditMode ? undefined : 'pointer' }}
          >
            Backing track
          </span>
          <input
            className="form-control"
            onChange={(event) => {
              const nextTab = tabOperations.updateBackingTrack(props.tab, event.target.value);
              props.updateTab(nextTab);
            }}
            onClick={openBackingTrack}
            readOnly={!props.isEditMode}
            style={{ cursor: props.isEditMode ? undefined : 'pointer' }}
            value={props.tab.backingTrack ?? ''}
          />
        </div>
      )}

      {(props.isEditMode || props.tab.capo) && (
        <div className="input-group mb-2" style={{ maxWidth: 250 }}>
          <span className="input-group-text">Capo</span>
          <input
            className="form-control"
            onChange={(event) => {
              const nextCapo = parseInt(event.target.value);
              const nextTab = tabOperations.updateCapo(
                props.tab,
                isNaN(nextCapo) ? undefined : nextCapo,
              );
              props.updateTab(nextTab);
            }}
            readOnly={!props.isEditMode}
            type="number"
            value={props.tab.capo ?? ''}
          />
        </div>
      )}
    </div>
  );
};
