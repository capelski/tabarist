import React, { MutableRefObject, useEffect } from 'react';
import { maxTempo, minTempo } from '../../constants';
import { tabOperations } from '../../operations';
import { BarContainer, Tab } from '../../types';

export type TabPlayProps = {
  barContainers: BarContainer[];
  isEditMode: boolean;
  isTabOwner: boolean;
  playTimeoutRef: MutableRefObject<number>;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

let activeSlotLastDelay = 0;
let activeSlotLastRender = 0;

export const TabPlay: React.FC<TabPlayProps> = (props) => {
  const updateActiveSlot = () => {
    if (props.tab.tempo && props.tab.activeSlot) {
      const msPerBeat = 60_000 / props.tab.tempo;

      activeSlotLastDelay = Date.now() - activeSlotLastRender;

      props.playTimeoutRef.current = window.setTimeout(() => {
        props.updateTab(tabOperations.updateActiveSlot(props.tab, props.barContainers));
        activeSlotLastRender = Date.now();
      }, msPerBeat - activeSlotLastDelay);
    } else {
      activeSlotLastDelay = 0;
      activeSlotLastRender = 0;
      props.playTimeoutRef.current = 0;
    }
  };

  useEffect(updateActiveSlot, [props.tab.activeSlot]);

  const enterPlayMode = () => {
    props.updateTab(tabOperations.updateActiveSlot(props.tab, props.barContainers));
    activeSlotLastRender = Date.now();
  };

  const exitPlayMode = () => {
    clearTimeout(props.playTimeoutRef.current);
    props.updateTab(tabOperations.resetActiveSlot(props.tab));
  };

  return (
    <div
      className="tab-play"
      style={{ backgroundColor: 'white', bottom: 0, paddingTop: 8, position: 'sticky' }}
    >
      <span style={{ marginLeft: 8 }}>♫</span>
      <input
        disabled={!!props.tab.activeSlot}
        onBlur={() => {
          if (props.tab.tempo) {
            const validTempo = Math.max(Math.min(props.tab.tempo, maxTempo), minTempo);
            if (validTempo !== props.tab.tempo) {
              props.updateTab(tabOperations.updateTempo(props.tab, validTempo));
            }
          }
        }}
        onChange={(event) => {
          const parsedTempo = parseInt(event.target.value);
          const nextTempo = isNaN(parsedTempo) ? undefined : parsedTempo;
          props.updateTab(tabOperations.updateTempo(props.tab, nextTempo));
        }}
        value={props.tab.tempo ?? ''}
        style={{ marginLeft: 8, maxWidth: 40 }}
        type="number"
      />

      {!props.isEditMode && (
        <button
          disabled={!props.tab.tempo}
          onClick={() => {
            if (props.tab.activeSlot === undefined) {
              enterPlayMode();
            } else {
              exitPlayMode();
            }
          }}
          style={{ marginLeft: 8 }}
          type="button"
        >
          {props.tab.activeSlot !== undefined ? 'Stop' : 'Play'}
        </button>
      )}
    </div>
  );
};
