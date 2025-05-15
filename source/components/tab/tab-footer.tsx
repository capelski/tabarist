import { User } from 'firebase/auth';
import React, { MutableRefObject, useContext, useEffect, useState } from 'react';
import clickSound from '../../assets/click.mp3';
import { maxTempo, minTempo, PlayMode } from '../../constants';
import { tabOperations } from '../../operations';
import { userRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { ActiveSlot, BarContainer, Tab } from '../../types';

// Audio is not available on the server side
declare const Audio: {
  new (src?: string): HTMLAudioElement;
};

const clickAudio = typeof Audio !== 'undefined' ? new Audio(clickSound) : undefined;

export type TabFooterProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  isDraft?: boolean;
  isEditMode: boolean | undefined;
  isStarred?: boolean;
  playTimeoutRef: MutableRefObject<number | undefined>;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  user: User | null;
};

let activeSlotLastDelay = 0;
let activeSlotLastRender = 0;

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const [activeCountdown, setActiveCountdown] = useState<number>();
  const [countdown, setCountdown] = useState<number>();
  const [playing, setPlaying] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>();

  const { dispatch } = useContext(StateProvider);

  const clearPlayState = () => {
    setActiveCountdown(countdown);
    setPlaying(false);
    clearTimeout(props.playTimeoutRef.current);
    activeSlotLastDelay = 0;
    activeSlotLastRender = 0;
    props.playTimeoutRef.current = undefined;
  };

  const updatePlayState = () => {
    if (playMode === PlayMode.metronome) {
      clickAudio?.play();
    }
    dispatch({ type: ActionType.activeSlotUpdate, barContainers: props.barContainers });
    activeSlotLastRender = Date.now();
  };

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (activeCountdown) {
      setTimeout(() => {
        setActiveCountdown(activeCountdown - 1);
      }, 1000);
    } else {
      updatePlayState();
    }
  }, [activeCountdown, playing]);

  const updateActiveSlot = () => {
    if (props.tab.tempo && props.activeSlot) {
      const msPerBeat = 60_000 / props.tab.tempo;
      activeSlotLastDelay = Date.now() - activeSlotLastRender;

      props.playTimeoutRef.current = window.setTimeout(
        updatePlayState,
        msPerBeat - activeSlotLastDelay,
      );
    } else {
      clearPlayState();
    }
  };

  useEffect(updateActiveSlot, [props.activeSlot]);

  const enterPlayMode = (nextCountdown: number | undefined, nextPlayMode?: PlayMode) => {
    setActiveCountdown(nextCountdown);
    setPlaying(true);
    if (nextPlayMode) {
      setPlayMode(nextPlayMode);
    }
  };

  const exitPlayMode = () => {
    clearPlayState();
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
        disabled={props.isDraft}
        onClick={toggleStarredTab}
        style={{ marginRight: 8 }}
        type="button"
      >
        ★
      </button>

      <div className="input-group" style={{ marginRight: 8, maxWidth: 100 }}>
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
          style={{ padding: 8, textAlign: 'center' }}
          type="number"
        />
      </div>

      <div
        className="btn-group"
        // Hiding instead of not rendering, as the bootstrap dropdown doesn't show after the first time otherwise
        style={{ display: props.isEditMode || props.activeSlot ? 'none' : undefined }}
      >
        <button
          className="btn btn-success"
          disabled={!props.tab.tempo}
          onClick={() => {
            enterPlayMode(countdown, PlayMode.metronome);
          }}
          type="button"
        >
          Play
        </button>
        <button
          className="btn btn-success dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          disabled={!props.tab.tempo}
          type="button"
        />
        <ul className="dropdown-menu">
          {Object.values(PlayMode).map((option) => {
            return (
              <li key={option}>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    enterPlayMode(countdown, option);
                  }}
                  href="#"
                >
                  {option}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {!props.isEditMode && props.activeSlot && (
        <div className="btn-group" role="group">
          {playing ? (
            <button className="btn btn-outline-success" onClick={clearPlayState} type="button">
              Pause
            </button>
          ) : (
            <button
              className="btn btn-outline-success"
              onClick={() => {
                enterPlayMode(countdown);
              }}
              type="button"
            >
              Play
            </button>
          )}
          <button className="btn btn-outline-danger" onClick={exitPlayMode} type="button">
            Stop
          </button>
        </div>
      )}

      <div className="input-group" style={{ marginLeft: 8, maxWidth: 100 }}>
        <span className="input-group-text">⏱️</span>
        <input
          className="form-control"
          disabled={playing}
          onBlur={() => {
            if (countdown) {
              const validCountdown = Math.max(Math.min(countdown, 15), 0);
              if (validCountdown === 0) {
                setCountdown(undefined);
              } else if (validCountdown !== countdown) {
                setCountdown(validCountdown);
              }
            }
          }}
          onChange={(event) => {
            const parsedCountdown = parseInt(event.target.value);
            const nextCountdown = isNaN(parsedCountdown) ? undefined : parsedCountdown;
            setCountdown(nextCountdown);
          }}
          value={(playing ? activeCountdown : countdown) ?? ''}
          style={{ padding: 8, textAlign: 'center' }}
          type="number"
        />
      </div>
    </div>
  );
};
