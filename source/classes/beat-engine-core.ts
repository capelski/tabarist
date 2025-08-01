export type BeatEngineHandlers = {
  clearTimeout: (id?: number) => void;
  getLastDelay: () => number;
  getLastRendered: () => number;
  initializeYoutubePlayer: (videoId: string, start?: number) => Promise<YT.Player>;
  scheduleBeat: (handler: () => void, delay?: number) => number;
  scheduleCountdown: (handler: () => void, delay?: number) => number;
  scheduleTrackStart: (handler: () => void, delay?: number) => number;
  startYoutubeTrack: (start?: number) => Promise<void>;
  triggerSound: () => void | Promise<void>;
};

export enum BeatEngineMode {
  metronome = 'metronome',
  silent = 'silent',
  youtubeTrack = 'youtubeTrack',
}

export enum BeatEnginePhase {
  countdown = 'countdown',
  initializing = 'initializing',
  new = 'new',
  playing = 'playing',
  paused = 'paused',
  stopped = 'stopped',
}

export class BeatEngineCore {
  protected countdownTimeout: number | undefined;
  protected lastDelay = 0;
  protected lastRender = 0;
  protected phase: BeatEnginePhase = BeatEnginePhase.new;
  protected nextBeatTimeout: number | undefined;
  protected youtubePlayer: YT.Player | undefined;
  protected youtubeCountdownTimeout: number | undefined;

  public onBeatUpdate?: () => void;
  public onCountdownUpdate?: (remainingCount: number) => void;
  public onPhaseChange?: (phase: BeatEnginePhase) => void;
  /** Defaults to PlayMode.metronome */
  public mode: BeatEngineMode = BeatEngineMode.metronome;
  /** Defaults to 100 */
  public tempo = 100;
  public youtubeTrack?: {
    videoId: string;
    start?: number;
  };

  constructor(protected handlers: BeatEngineHandlers) {}

  protected decreaseCountdownInternal(resolve: () => void, countdownRemaining: number) {
    this.onCountdownUpdate?.(countdownRemaining);

    this.countdownTimeout = this.handlers.scheduleCountdown(async () => {
      const nextCountdownRemaining = countdownRemaining - 1;
      if (nextCountdownRemaining > 0) {
        this.decreaseCountdownInternal(resolve, nextCountdownRemaining);
      } else {
        this.onCountdownUpdate?.(nextCountdownRemaining);
        resolve();
      }
    }, 1000);

    if (countdownRemaining === 1 && this.mode === BeatEngineMode.youtubeTrack) {
      const startTrackDelay = 1000 - this.getTrackStartMilliseconds();
      this.youtubeCountdownTimeout = this.handlers.scheduleTrackStart(() => {
        this.handlers.startYoutubeTrack(this.getTrackStartMilliseconds());
      }, startTrackDelay);
    }
  }

  protected getTrackStartMilliseconds = () => {
    return (this.youtubeTrack?.start ?? 0) % 1000;
  };

  protected getTrackStartSeconds = () => {
    return Math.floor((this.youtubeTrack?.start ?? 0) / 1000);
  };

  protected processCurrentBeat() {
    if (this.mode === BeatEngineMode.metronome) {
      this.handlers.triggerSound();
    }
    this.onBeatUpdate?.();
    this.lastRender = this.handlers.getLastRendered();
    this.scheduleNextBeat();
  }

  protected scheduleNextBeat() {
    const msPerBeat = 60_000 / this.tempo;
    this.lastDelay = this.handlers.getLastDelay() - this.lastRender;
    this.nextBeatTimeout = this.handlers.scheduleBeat(() => {
      this.processCurrentBeat();
    }, msPerBeat - this.lastDelay);
  }

  protected setPhase(nextPhase: BeatEnginePhase) {
    this.phase = nextPhase;
    this.onPhaseChange?.(this.phase);
  }

  protected setCountdown(countdownRemaining: number) {
    this.setPhase(BeatEnginePhase.countdown);

    return new Promise<void>((resolve) => {
      this.decreaseCountdownInternal(resolve, countdownRemaining);
    });
  }

  protected stopCore() {
    this.handlers.clearTimeout(this.countdownTimeout);
    this.handlers.clearTimeout(this.nextBeatTimeout);
    this.handlers.clearTimeout(this.youtubeCountdownTimeout);

    this.countdownTimeout = undefined;
    this.lastDelay = 0;
    this.lastRender = 0;
    this.nextBeatTimeout = undefined;
    this.youtubeCountdownTimeout = undefined;
  }

  destroy() {
    this.youtubePlayer?.destroy();
  }

  pause() {
    this.stopCore();
    this.youtubePlayer?.pauseVideo();

    this.setPhase(BeatEnginePhase.paused);
  }

  async resume(countdown?: number) {
    if (countdown) {
      await this.setCountdown(countdown);
    }

    this.youtubePlayer?.playVideo();
    this.setPhase(BeatEnginePhase.playing);
    this.processCurrentBeat();
  }

  setYoutubePlaybackRate(playbackRate: number) {
    this.youtubePlayer?.setPlaybackRate(playbackRate);
  }

  async start(countdown?: number) {
    this.setPhase(BeatEnginePhase.initializing);

    if (this.mode === BeatEngineMode.youtubeTrack && this.youtubeTrack && !this.youtubePlayer) {
      this.youtubePlayer = await this.handlers.initializeYoutubePlayer(
        this.youtubeTrack.videoId,
        this.getTrackStartSeconds(),
      );
    }

    if (this.phase === BeatEnginePhase.stopped) {
      return;
    }

    if (countdown) {
      await this.setCountdown(countdown);
    } else if (this.mode === BeatEngineMode.youtubeTrack) {
      await this.handlers.startYoutubeTrack(this.getTrackStartMilliseconds());
    }

    this.setPhase(BeatEnginePhase.playing);

    this.processCurrentBeat();
  }

  stop() {
    this.stopCore();
    // Instead of stopping the video, get it ready to play again
    this.youtubePlayer?.pauseVideo();
    this.youtubePlayer?.seekTo(this.getTrackStartSeconds(), true);

    this.setPhase(BeatEnginePhase.stopped);
  }
}
