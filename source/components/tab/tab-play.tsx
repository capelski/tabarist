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

let activeFrameLastDelay = 0;
let activeFrameLastRender = 0;

export const TabPlay: React.FC<TabPlayProps> = (props) => {
  const updateActiveFrame = () => {
    if (props.tab.tempo && props.tab.activeFrame) {
      const msPerBeat = 60_000 / props.tab.tempo;
      const msPerBar = msPerBeat * 4;
      const msPerFrame = msPerBar / props.tab.activeFrame.barContainer.renderedBar.frames.length;

      activeFrameLastDelay = Date.now() - activeFrameLastRender; // - msPerFrame;

      props.playTimeoutRef.current = window.setTimeout(() => {
        props.updateTab(tabOperations.updateActiveFrame(props.tab, props.barContainers));
        activeFrameLastRender = Date.now();
      }, msPerFrame - activeFrameLastDelay);
    } else {
      activeFrameLastDelay = 0;
      activeFrameLastRender = 0;
      props.playTimeoutRef.current = 0;
    }
  };

  useEffect(updateActiveFrame, [props.tab.activeFrame]);

  const enterPlayMode = () => {
    props.updateTab(tabOperations.updateActiveFrame(props.tab, props.barContainers));
    activeFrameLastRender = Date.now();
  };

  const exitPlayMode = () => {
    clearTimeout(props.playTimeoutRef.current);
    props.updateTab(tabOperations.resetActiveFrame(props.tab));
  };

  return (
    <div
      className="tab-play"
      style={{ backgroundColor: 'white', bottom: 0, paddingTop: 8, position: 'sticky' }}
    >
      <span style={{ marginLeft: 8 }}>♫</span>
      <input
        disabled={!!props.tab.activeFrame}
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
            if (props.tab.activeFrame === undefined) {
              enterPlayMode();
            } else {
              exitPlayMode();
            }
          }}
          style={{ marginLeft: 8 }}
          type="button"
        >
          {props.tab.activeFrame !== undefined ? 'Stop' : 'Play'}
        </button>
      )}
    </div>
  );
};
