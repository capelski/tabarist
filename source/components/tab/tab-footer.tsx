import { User } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { BeatEngine } from '../../classes';
import { BeatEngineMode, BeatEnginePhase } from '../../classes/beat-engine-core';
import { maxTempo, minTempo } from '../../constants';
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

const PlayModeMap = {
  [BeatEngineMode.metronome]: 'Ⓜ️ Metronome',
  [BeatEngineMode.silent]: '🔇 Silent',
  [BeatEngineMode.youtubeTrack]: '🎵 Youtube Track',
};

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const [countdown, setCountdown] = useState<number>();
  const [countdownRemaining, setCountdownRemaining] = useState<number>();
  const [phase, setPhase] = useState<BeatEnginePhase>(BeatEnginePhase.new);

  const isBeatEngineActive =
    phase === BeatEnginePhase.countdown ||
    phase === BeatEnginePhase.initializing ||
    phase === BeatEnginePhase.playing;
  const isBeatEngineIdle = phase === BeatEnginePhase.new || phase === BeatEnginePhase.stopped;

  const { dispatch } = useContext(StateProvider);

  useEffect(() => {
    props.beatEngine.tempo = props.tab.tempo ?? 100;

    props.beatEngine.onBeatUpdate = () => {
      dispatch({ type: ActionType.activeSlotUpdate, barContainers: props.barContainers });
    };

    props.beatEngine.onCountdownUpdate = setCountdownRemaining;

    props.beatEngine.onPhaseChange = setPhase;

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
    // Stop playing when reaching the end of the tab
    if (!props.activeSlot && !isBeatEngineIdle) {
      stopPlayMode();
    }
  }, [props.activeSlot]);

  const pausePlayMode = () => {
    props.beatEngine.pause();
  };

  const resumePlayMode = () => {
    props.beatEngine.resume(countdown);
  };

  const startPlayMode = () => {
    props.beatEngine.start(countdown);
  };

  const stopPlayMode = () => {
    props.beatEngine.stop();
    setCountdownRemaining(undefined);
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

  const availablePlayModes = Object.values(BeatEngineMode).filter(
    (p) => p !== BeatEngineMode.youtubeTrack || props.youtubeVideoId,
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
            disabled={isBeatEngineActive}
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
        style={{
          display: props.isEditMode || !isBeatEngineIdle ? 'none' : undefined,
        }}
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
                    if (option === BeatEngineMode.youtubeTrack && !props.subscription) {
                      dispatch({ type: ActionType.upgradeStart });
                    } else {
                      props.beatEngine.mode = option;
                      startPlayMode();
                    }
                  }}
                >
                  {PlayModeMap[option]}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {phase === BeatEnginePhase.initializing && <span style={{ marginRight: 8 }}>⏳</span>}

      {!props.isEditMode && !isBeatEngineIdle && (
        <div className="btn-group" role="group">
          {phase === BeatEnginePhase.paused ? (
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
