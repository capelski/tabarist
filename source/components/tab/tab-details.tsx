import React, { useState } from 'react';
import { tabOperations } from '../../operations';
import { Tab } from '../../types';
import { Modal } from '../common/modal';

export type TabDetailsProps = {
  isEditMode: boolean | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  youtubeVideoCode: string | undefined;
};

export const TabDetails: React.FC<TabDetailsProps> = (props) => {
  const [backingTrackModal, setBackingTrackModal] = useState(false);

  const openBackingTrack = () => {
    if (props.isEditMode) {
      return;
    }

    window.open(props.tab.backingTrack);
  };

  return (
    <div className="tab-details">
      {backingTrackModal && (
        <Modal
          closeHandler={() => {
            setBackingTrackModal(false);
          }}
        >
          <p>
            URL of a backing track for the tab. If a <b>YouTube</b> URL is provided it can be played
            along with the tab.
          </p>
        </Modal>
      )}

      {(props.isEditMode || props.tab.backingTrack) && (
        <div className="input-group mb-2">
          <span className="input-group-text">Backing track</span>
          <input
            className="form-control"
            onChange={(event) => {
              const nextTab = tabOperations.updateBackingTrack(props.tab, event.target.value);
              props.updateTab(nextTab);
            }}
            readOnly={!props.isEditMode}
            value={props.tab.backingTrack ?? ''}
          />
          {props.isEditMode ? (
            <button
              className={`btn${props.youtubeVideoCode ? ' btn-success' : ' btn-outline-secondary'}`}
              type="button"
              onClick={() => {
                setBackingTrackModal(true);
              }}
            >
              ?
            </button>
          ) : (
            props.tab.backingTrack && (
              <span
                className="input-group-text"
                onClick={openBackingTrack}
                style={{ cursor: 'pointer' }}
              >
                ↗️
              </span>
            )
          )}
        </div>
      )}

      {props.isEditMode && props.youtubeVideoCode && (
        <div className="input-group mb-2" style={{ maxWidth: 300 }}>
          <span className="input-group-text">Track start (ms)</span>
          <input
            className="form-control"
            onChange={(event) => {
              const nextTrackStart = parseInt(event.target.value);
              const nextTab = tabOperations.updateTrackStart(
                props.tab,
                isNaN(nextTrackStart) ? undefined : nextTrackStart,
              );
              props.updateTab(nextTab);
            }}
            type="number"
            value={props.tab.trackStart ?? ''}
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
