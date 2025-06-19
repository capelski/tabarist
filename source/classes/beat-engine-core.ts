export type BeatEngineHandlers = {
  clearTimeout: (id?: number) => void;
  getLastDelay: () => number;
  getLastRendered: () => number;
  initializeYoutubePlayer: (videoId: string, start?: number) => Promise<YT.Player>;
  setTimeout: (handler: () => void, delay?: number) => number;
  startYoutubeTrack: (start?: number) => void;
  triggerSound: () => void | Promise<void>;
};

export enum PlayMode {
  metronome = 'metronome',
  silent = 'silent',
  youtubeTrack = 'youtubeTrack',
}

export class BeatEngineCore {
  protected countdownTimeout: number | undefined;
  protected lastDelay = 0;
  protected lastRender = 0;
  protected nextBeatTimeout: number | undefined;
  protected youtubePlayer: YT.Player | undefined;
  protected youtubeDelayTimeout: number | undefined;

  public onBeatUpdate?: () => void;
  public onCountdownUpdate?: (remainingCount: number) => void;
  /** Defaults to PlayMode.metronome */
  public playMode: PlayMode = PlayMode.metronome;
  /** Defaults to 100 */
  public tempo = 100;
  public youtubeTrack?: {
    videoId: string;
    start?: number;
  };

  constructor(protected handlers: BeatEngineHandlers) {}

  protected decreaseCountdownInternal(resolve: () => void, countdownRemaining: number) {
    this.onCountdownUpdate?.(countdownRemaining);
    this.countdownTimeout = this.handlers.setTimeout(async () => {
      const nextCountdownRemaining = countdownRemaining - 1;
      if (nextCountdownRemaining > 0) {
        this.decreaseCountdownInternal(resolve, nextCountdownRemaining);
      } else {
        this.onCountdownUpdate?.(nextCountdownRemaining);
        resolve();
      }
    }, 1000);
  }

  protected decreaseCountdown(countdownRemaining: number) {
    return new Promise<void>((resolve) => {
      this.decreaseCountdownInternal(resolve, countdownRemaining);
    });
  }

  protected getTrackStartMilliseconds = () => {
    return (this.youtubeTrack?.start ?? 0) % 1000;
  };

  protected getTrackStartSeconds = () => {
    return Math.floor((this.youtubeTrack?.start ?? 0) / 1000);
  };

  protected processCurrentBeat() {
    if (this.playMode === PlayMode.metronome) {
      this.handlers.triggerSound();
    }
    this.onBeatUpdate?.();
    this.lastRender = this.handlers.getLastRendered();
    this.scheduleNextBeat();
  }

  protected scheduleNextBeat() {
    const msPerBeat = 60_000 / this.tempo;
    this.lastDelay = this.handlers.getLastDelay() - this.lastRender;
    this.nextBeatTimeout = this.handlers.setTimeout(() => {
      this.processCurrentBeat();
    }, msPerBeat - this.lastDelay);
  }

  protected stopCore() {
    this.handlers.clearTimeout(this.countdownTimeout);
    this.handlers.clearTimeout(this.nextBeatTimeout);
    this.handlers.clearTimeout(this.youtubeDelayTimeout);

    this.countdownTimeout = undefined;
    this.lastDelay = 0;
    this.lastRender = 0;
    this.nextBeatTimeout = undefined;
    this.youtubeDelayTimeout = undefined;
  }

  destroy() {
    this.youtubePlayer?.destroy();
  }

  pause() {
    this.stopCore();
    this.youtubePlayer?.pauseVideo();
  }

  async resume(countdown?: number) {
    if (countdown) {
      await this.decreaseCountdown(countdown);
    }

    this.youtubePlayer?.playVideo();
    this.processCurrentBeat();
  }

  async start(countdown?: number) {
    if (this.playMode === PlayMode.youtubeTrack && this.youtubeTrack && !this.youtubePlayer) {
      this.youtubePlayer = await this.handlers.initializeYoutubePlayer(
        this.youtubeTrack.videoId,
        this.getTrackStartSeconds(),
      );
    }

    if (countdown) {
      await this.decreaseCountdown(countdown);
    }

    if (this.playMode === PlayMode.youtubeTrack) {
      await this.handlers.startYoutubeTrack(this.getTrackStartMilliseconds());
    }

    this.processCurrentBeat();
  }

  stop() {
    this.stopCore();
    // Instead of stopping the video, get it ready to play again
    this.youtubePlayer?.pauseVideo();
    this.youtubePlayer?.seekTo(this.getTrackStartSeconds(), true);
  }
}
