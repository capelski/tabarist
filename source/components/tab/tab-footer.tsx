import { User } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { BeatEngine } from '../../classes';
import { maxTempo, minTempo, PlayMode, PlayPhase } from '../../constants';
import { tabOperations } from '../../operations';
import { userRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { ActiveSlot, BarContainer, StripeSubscription, Tab } from '../../types';

export type TabFooterProps = {
  activeSlot: ActiveSlot | undefined;
  barContainers: BarContainer[];
  beatEngine: BeatEngine;
  isDraft?: boolean;
  isEditMode: boolean | undefined;
  isStarred?: boolean;
  subscription?: StripeSubscription;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  user: User | null;
  youtubeVideoId: string | undefined;
};

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const [countdown, setCountdown] = useState<number>();
  const [countdownRemaining, setCountdownRemaining] = useState<number>();
  const [playPhase, setPlayPhase] = useState<PlayPhase>();

  const { dispatch } = useContext(StateProvider);

  useEffect(() => {
    props.beatEngine.tempo = props.tab.tempo ?? 100;

    props.beatEngine.onBeatUpdate = () => {
      if (playPhase !== PlayPhase.playing) {
        setPlayPhase(PlayPhase.playing);
      }
      dispatch({ type: ActionType.activeSlotUpdate, barContainers: props.barContainers });
    };

    props.beatEngine.onCountdownUpdate = setCountdownRemaining;

    return props.beatEngine.destroy.bind(props.beatEngine);
  }, []);

  useEffect(() => {
    if (props.youtubeVideoId) {
      props.beatEngine.youtubeTrack = {
        videoId: props.youtubeVideoId,
        start: props.tab.trackStart,
      };
    }
  }, [props.youtubeVideoId]);

  useEffect(() => {
    if (!playPhase) {
      return;
    }

    if (playPhase === PlayPhase.initializing) {
      props.beatEngine.start(countdown);
      return;
    }

    if (playPhase === PlayPhase.paused) {
      props.beatEngine.pause();
      return;
    }

    if (playPhase === PlayPhase.resuming) {
      props.beatEngine.resume(countdown);
      return;
    }

    if (playPhase === PlayPhase.stopping) {
      props.beatEngine.stop();
      setCountdownRemaining(undefined);
      setPlayPhase(undefined);
      dispatch({ type: ActionType.activeSlotClear });
      return;
    }
  }, [playPhase]);

  useEffect(() => {
    // Stop playing when reaching the end of the tab
    if (!props.activeSlot && playPhase && playPhase !== PlayPhase.stopping) {
      setPlayPhase(PlayPhase.stopping);
    }
  }, [props.activeSlot]);

  const pausePlayMode = () => {
    setPlayPhase(PlayPhase.paused);
  };

  const resumePlayMode = () => {
    setPlayPhase(PlayPhase.resuming);
  };

  const startPlayMode = () => {
    setPlayPhase(PlayPhase.initializing);
  };

  const stopPlayMode = () => {
    setPlayPhase(PlayPhase.stopping);
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

  const availablePlayModes = Object.values(PlayMode).filter(
    (p) => p !== PlayMode.youtubeTrack || props.youtubeVideoId,
  );

  return (
    <div
      className="tab-play"
      style={{
        alignItems: 'center',
        backgroundColor: 'white',
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0',
        position: 'sticky',
      }}
    >
      {!props.isEditMode && (
        <button
          className={`btn ${props.isStarred ? 'btn-primary' : 'btn-outline-primary'}`}
          disabled={props.isDraft}
          onClick={toggleStarredTab}
          style={{ marginRight: 8 }}
          type="button"
        >
          ★
        </button>
      )}

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
                props.beatEngine.tempo = validTempo;
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

      {!props.isEditMode && (
        <div className="input-group" style={{ marginRight: 8, maxWidth: 100 }}>
          <span className="input-group-text">⏱️</span>
          <input
            className="form-control"
            disabled={playPhase && playPhase !== PlayPhase.paused}
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
            value={(countdownRemaining || countdown) ?? ''}
            style={{ padding: 8, textAlign: 'center' }}
            type="number"
          />
        </div>
      )}

      <div
        className="btn-group"
        // Hiding instead of not rendering, as the bootstrap dropdown doesn't show after the first time otherwise
        style={{ display: props.isEditMode || playPhase ? 'none' : undefined }}
      >
        <button
          className="btn btn-success"
          disabled={!props.tab.tempo}
          onClick={startPlayMode}
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
          {availablePlayModes.map((option) => {
            return (
              <li key={option}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    if (option === PlayMode.youtubeTrack && !props.subscription) {
                      dispatch({ type: ActionType.upgradeStart });
                    } else {
                      props.beatEngine.playMode = option;
                      startPlayMode();
                    }
                  }}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {playPhase === PlayPhase.initializing && <span style={{ marginRight: 8 }}>⏳</span>}

      {!props.isEditMode && playPhase && (
        <div className="btn-group" role="group">
          {playPhase === PlayPhase.paused ? (
            <button className="btn btn-outline-success" onClick={resumePlayMode} type="button">
              Play
            </button>
          ) : (
            <button className="btn btn-outline-success" onClick={pausePlayMode} type="button">
              Pause
            </button>
          )}
          <button className="btn btn-outline-danger" onClick={stopPlayMode} type="button">
            Stop
          </button>
        </div>
      )}
    </div>
  );
};
