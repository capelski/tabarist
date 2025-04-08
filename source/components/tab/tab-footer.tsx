import { User } from 'firebase/auth';
import React, { MutableRefObject, useContext, useEffect } from 'react';
import { maxTempo, minTempo } from '../../constants';
import { tabOperations } from '../../operations';
import { userRepository } from '../../repositories';
import { ActionType, DispatchProvider } from '../../state';
import { ActiveSlot, BarContainer, Tab } from '../../types';

export type TabFooterProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  isEditMode: boolean;
  isStarred?: boolean;
  playTimeoutRef: MutableRefObject<number>;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  user: User | null;
};

let activeSlotLastDelay = 0;
let activeSlotLastRender = 0;

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const dispatch = useContext(DispatchProvider);

  const updateActiveSlot = () => {
    if (props.tab.tempo && props.activeSlot) {
      const msPerBeat = 60_000 / props.tab.tempo;

      activeSlotLastDelay = Date.now() - activeSlotLastRender;

      props.playTimeoutRef.current = window.setTimeout(() => {
        dispatch({ type: ActionType.activeSlotUpdate, barContainers: props.barContainers });
        activeSlotLastRender = Date.now();
      }, msPerBeat - activeSlotLastDelay);
    } else {
      activeSlotLastDelay = 0;
      activeSlotLastRender = 0;
      props.playTimeoutRef.current = 0;
    }
  };

  useEffect(updateActiveSlot, [props.activeSlot]);

  const enterPlayMode = () => {
    dispatch({ type: ActionType.activeSlotUpdate, barContainers: props.barContainers });
    activeSlotLastRender = Date.now();
  };

  const exitPlayMode = () => {
    clearTimeout(props.playTimeoutRef.current);
    dispatch({ type: ActionType.activeSlotClear });
  };

  const toggleStarredTab = async () => {
    if (!props.user) {
      dispatch({ type: ActionType.signInStart, message: 'Sign in to star this tab' });
      return;
    }

    if (props.isStarred) {
      await userRepository.removeStarredTab(props.user.uid, props.tab.id);
      dispatch({ type: ActionType.setStarredTab, starredTab: false });
    } else {
      await userRepository.setStarredTab(props.user.uid, props.tab);
      dispatch({ type: ActionType.setStarredTab, starredTab: true });
    }
  };

  return (
    <div
      className="tab-play"
      style={{
        backgroundColor: 'white',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0',
        position: 'sticky',
      }}
    >
      <button
        className={`btn ${props.isStarred ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={toggleStarredTab}
        style={{ marginRight: 8 }}
        type="button"
      >
        ★
      </button>

      <div className="input-group" style={{ maxWidth: 180 }}>
        <span className="input-group-text">♫</span>
        <input
          className="form-control"
          disabled={!!props.activeSlot}
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
          style={{ textAlign: 'center' }}
          type="number"
        />

        {!props.isEditMode &&
          (props.activeSlot ? (
            <button className="btn btn-danger" onClick={exitPlayMode} type="button">
              Stop
            </button>
          ) : (
            <button
              className="btn btn-success"
              disabled={!props.tab.tempo}
              onClick={() => {
                enterPlayMode();
              }}
              type="button"
            >
              Play
            </button>
          ))}
      </div>
    </div>
  );
};
