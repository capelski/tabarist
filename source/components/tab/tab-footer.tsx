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
  youtubeVideoCode: string | undefined;
};

export const TabFooter: React.FC<TabFooterProps> = (props) => {
  const [countdown, setCountdown] = useState<number>();
  const [countdownRemaining, setCountdownRemaining] = useState<number>();
  const [playPhase, setPlayPhase] = useState<PlayPhase>();
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
    if (!playPhase) {
      return;
    }

    if (playPhase === PlayPhase.initializing) {
      if (props.beatEngine.options.playMode !== PlayMode.youtubeTrack) {
        setPlayPhase(PlayPhase.playing);
        return;
      }

      if (youtubePlayer) {
        // When playing a second time, the youtube player will have already been initialized
        setPlayPhase(PlayPhase.playing);
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
                setPlayPhase(PlayPhase.playing);
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

    if (playPhase === PlayPhase.paused) {
      clearPlayState();
      return;
    }

    if (playPhase === PlayPhase.playing) {
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

    if (playPhase === PlayPhase.resuming) {
      props.beatEngine.options.beforeStart = () => {
        youtubePlayer?.playVideo();
      };
      props.beatEngine.start(countdown);
      return;
    }

    if (playPhase === PlayPhase.stopping) {
      clearPlayState();
      setCountdownRemaining(undefined);
      setPlayPhase(undefined);
      dispatch({ type: ActionType.activeSlotClear });
      // Instead of stopping the video, get it ready to play again
      youtubePlayer?.pauseVideo();
      youtubePlayer?.seekTo(trackStartSeconds, true);
      return;
    }
  }, [playPhase]);

  useEffect(() => {
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
