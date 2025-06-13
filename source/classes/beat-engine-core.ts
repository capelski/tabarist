import { PlayMode } from '../constants';

export type BeatEngineHandlers = {
  clearTimeout: (id?: number) => void;
  getLastDelay: () => number;
  getLastRendered: () => number;
  setTimeout: (handler: Function, delay?: number) => number;
  triggerSound: () => void | Promise<void>;
};

export type BeatEngineOptions = {
  beforeStart?: () => void | Promise<void>;
  onBeatUpdate?: () => void;
  onCountdownUpdate?: (remainingCount: number) => void;
  playMode: PlayMode;
  tempo: number;
};

export class BeatEngineCore {
  protected countdownRemaining: number = 0;
  protected countdownTimeout: number | undefined;
  protected lastDelay = 0;
  protected lastRender = 0;
  protected nextBeatTimeout: number | undefined;

  constructor(protected handlers: BeatEngineHandlers, public options: BeatEngineOptions) {}

  protected decreaseCountdown() {
    this.countdownTimeout = this.handlers.setTimeout(async () => {
      this.countdownRemaining = this.countdownRemaining - 1;
      this.options.onCountdownUpdate?.(this.countdownRemaining);
      if (this.countdownRemaining > 0) {
        this.decreaseCountdown();
      } else {
        await this.options.beforeStart?.();
        this.processCurrentBeat();
      }
    }, 1000);
  }

  protected processCurrentBeat() {
    if (this.options.playMode === PlayMode.metronome) {
      this.handlers.triggerSound();
    }
    this.options.onBeatUpdate?.();
    this.lastRender = this.handlers.getLastRendered();
    this.scheduleNextBeat();
  }

  protected scheduleNextBeat() {
    const msPerBeat = 60_000 / this.options.tempo;
    this.lastDelay = this.handlers.getLastDelay() - this.lastRender;
    this.nextBeatTimeout = this.handlers.setTimeout(() => {
      this.processCurrentBeat();
    }, msPerBeat - this.lastDelay);
  }

  async start(countdown?: number) {
    if (countdown) {
      this.countdownRemaining = countdown;
      this.options.onCountdownUpdate?.(this.countdownRemaining);
      this.decreaseCountdown();
    } else {
      await this.options.beforeStart?.();
      this.processCurrentBeat();
    }
  }

  stop() {
    this.handlers.clearTimeout(this.countdownTimeout);
    this.handlers.clearTimeout(this.nextBeatTimeout);
    this.countdownTimeout = undefined;
    this.nextBeatTimeout = undefined;

    this.countdownRemaining = 0;
    this.lastDelay = 0;
    this.lastRender = 0;
  }
}
