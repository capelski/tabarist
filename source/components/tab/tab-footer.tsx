import { User } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';
import { BeatEngine } from '../../classes';
import { maxTempo, minTempo, PlayMode, PlayPhase } from '../../constants';
import { tabOperations } from '../../operations';
import { userRepository } from '../../repositories';
import { ActionType, StateProvider } from '../../state';
import { ActiveSlot, BarContainer, PlayState, StripeSubscription, Tab } from '../../types';

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
  youtubeVideoCode: string | undefined;
};

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const [countdown, setCountdown] = useState<number>();
  const [countdownRemaining, setCountdownRemaining] = useState<number>();
  const [playState, setPlayState] = useState<PlayState>();
  const [youtubePlayer, setYoutubePlayer] = useState<YT.Player>();
  const [youtubeDelayTimeout, setYoutubeDelayTimeout] = useState<number>();

  const { dispatch } = useContext(StateProvider);

  const trackStartSeconds = Math.floor((props.tab.trackStart ?? 0) / 1000);

  const clearPlayState = () => {
    clearTimeout(youtubeDelayTimeout);
    props.beatEngine.stop();

    youtubePlayer?.pauseVideo();
  };

  useEffect(() => {
    props.beatEngine.options.onCountdownUpdate = setCountdownRemaining;
  }, []);

  useEffect(() => {
    return () => {
      youtubePlayer?.destroy();
    };
  }, [youtubePlayer]);

  useEffect(() => {
    if (!playState) {
      return;
    }

    if (playState.phase === PlayPhase.initializing) {
      if (props.beatEngine.options.playMode !== PlayMode.youtubeTrack) {
        setPlayState({ phase: PlayPhase.playing });
        return;
      }

      if (youtubePlayer) {
        // When playing a second time, the youtube player will have already been initialized
        setPlayState({ phase: PlayPhase.playing });
        return;
      }

      // https://developers.google.com/youtube/iframe_api_reference
      new YT.Player('youtube-player', {
        events: {
          onReady: (event) => {
            const nextYoutubePlayer = event.target;
            setYoutubePlayer(nextYoutubePlayer);

            // On mobile, it takes a while for the video to start playing
            nextYoutubePlayer.mute();
            nextYoutubePlayer.playVideo();

            setTimeout(() => {
              nextYoutubePlayer.pauseVideo();
              nextYoutubePlayer.unMute();
              nextYoutubePlayer.seekTo(trackStartSeconds, true);

              setTimeout(() => {
                setPlayState({ phase: PlayPhase.playing });
              }, 2000);
            }, 2000);
          },
        },
        playerVars: {
          start: trackStartSeconds,
        },
        videoId: props.youtubeVideoCode,
      });
      return;
    }

    if (playState.phase === PlayPhase.paused) {
      clearPlayState();
      return;
    }

    if (playState.phase === PlayPhase.playing) {
      props.beatEngine.options.beforeStart = () => {
        if (!youtubePlayer) {
          return undefined;
        }

        return new Promise<void>((resolve) => {
          const millisecondsDelay = (props.tab.trackStart ?? 0) % 1000;

          const nextYoutubeDelayTimeout = window.setTimeout(resolve, millisecondsDelay);

          youtubePlayer.playVideo();

          setYoutubeDelayTimeout(nextYoutubeDelayTimeout);
        });
      };
      props.beatEngine.start(countdown);
      return;
    }

    if (playState.phase === PlayPhase.resuming) {
      props.beatEngine.options.beforeStart = () => {
        youtubePlayer?.playVideo();
      };
      props.beatEngine.start(countdown);
      return;
    }

    if (playState.phase === PlayPhase.stopping) {
      clearPlayState();
      setCountdownRemaining(undefined);
      setPlayState(undefined);
      dispatch({ type: ActionType.activeSlotClear });
      // Instead of stopping the video, get it ready to play again
      youtubePlayer?.pauseVideo();
      youtubePlayer?.seekTo(trackStartSeconds, true);
      return;
    }
  }, [playState]);

  useEffect(() => {
    if (!props.activeSlot && playState && playState.phase !== PlayPhase.stopping) {
      setPlayState({ phase: PlayPhase.stopping });
    }
  }, [props.activeSlot]);

  const pausePlayMode = () => {
    setPlayState({ phase: PlayPhase.paused });
  };

  const resumePlayMode = () => {
    setPlayState({ phase: PlayPhase.resuming });
  };

  const startPlayMode = () => {
    setPlayState({ phase: PlayPhase.initializing });
  };

  const stopPlayMode = () => {
    setPlayState({ phase: PlayPhase.stopping });
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
    (p) => p !== PlayMode.youtubeTrack || props.youtubeVideoCode,
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
                props.beatEngine.options.tempo = validTempo;
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
            disabled={playState && playState.phase !== PlayPhase.paused}
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
        style={{ display: props.isEditMode || playState ? 'none' : undefined }}
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
                      props.beatEngine.options.playMode = option;
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

      {playState?.phase === PlayPhase.initializing && <span style={{ marginRight: 8 }}>⏳</span>}

      {!props.isEditMode && playState && (
        <div className="btn-group" role="group">
          {playState.phase === PlayPhase.paused ? (
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
