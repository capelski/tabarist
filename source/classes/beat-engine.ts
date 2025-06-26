import clickSound from '../assets/click.mp3';
import { BeatEngineCore } from './beat-engine-core';

const clickAudio = typeof Audio !== 'undefined' ? new Audio(clickSound) : undefined;

const context = typeof window === 'undefined' ? global : window;

export class BeatEngine extends BeatEngineCore {
  protected youtubeDelayTimeout: number | undefined;

  constructor() {
    super({
      clearTimeout: context.clearTimeout.bind(context),
      getLastDelay: Date.now.bind(Date),
      getLastRendered: Date.now.bind(Date),
      initializeYoutubePlayer: (videoId: string, start?: number) => {
        return new Promise<YT.Player>((resolve) => {
          // https://developers.google.com/youtube/iframe_api_reference
          new YT.Player('youtube-player', {
            events: {
              onReady: (event) => {
                const player = event.target;

                // On mobile, it takes a while for the video to start playing
                player.mute();
                player.playVideo();

                setTimeout(() => {
                  player.pauseVideo();
                  player.unMute();
                  player.seekTo(start ?? 0, true);

                  setTimeout(() => {
                    resolve(player);
                  }, 2000);
                }, 2000);
              },
            },
            playerVars: {
              start,
            },
            videoId,
          });
        });
      },
      scheduleBeat: context.setTimeout.bind(context),
      scheduleCountdown: context.setTimeout.bind(context),
      scheduleTrackStart: context.setTimeout.bind(context),
      startYoutubeTrack: (start) => {
        return new Promise<void>((resolve) => {
          this.youtubeDelayTimeout = setTimeout(resolve, start) as unknown as number;
          this.youtubePlayer!.playVideo();
        });
      },
      triggerSound: () => clickAudio?.play(),
    });
  }

  protected stopCore(): void {
    this.handlers.clearTimeout(this.youtubeDelayTimeout);

    super.stopCore();

    this.youtubeDelayTimeout = undefined;
  }
}
