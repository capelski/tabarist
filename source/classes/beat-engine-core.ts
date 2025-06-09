import { PlayMode } from '../constants';

export type BeatEngineHandlers = {
  clearTimeout: (id?: number) => void;
  getCurrentTimestamp: () => number;
  setTimeout: (handler: TimerHandler, delay?: number) => number;
  triggerSound: () => void | Promise<void>;
};

export type BeatEngineOptions = {
  onBeatUpdate?: () => void;
  playMode: PlayMode;
  /** Defaults to 100 */
  tempo?: number;
};

export class BeatEngineCore {
  lastDelay = 0;
  lastRender = 0;
  nextTimeout: number | undefined;

  constructor(protected handlers: BeatEngineHandlers, public options: BeatEngineOptions) {}

  protected processCurrentBeat() {
    if (this.options.playMode === PlayMode.metronome) {
      this.handlers.triggerSound();
    }
    this.options.onBeatUpdate?.();
    this.lastRender = this.handlers.getCurrentTimestamp();
    this.scheduleNext();
  }

  protected scheduleNext() {
    const msPerBeat = 60_000 / (this.options.tempo ?? 100);
    this.lastDelay = this.handlers.getCurrentTimestamp() - this.lastRender;
    this.nextTimeout = window.setTimeout(() => {
      this.processCurrentBeat();
    }, msPerBeat - this.lastDelay);
  }

  start() {
    this.processCurrentBeat();
  }

  stop() {
    this.handlers.clearTimeout(this.nextTimeout);
    this.lastDelay = 0;
    this.lastRender = 0;
    this.nextTimeout = undefined;
  }
}
