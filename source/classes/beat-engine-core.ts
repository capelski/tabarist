import { PlayMode } from '../constants';

export type BeatEngineHandlers = {
  clearTimeout: (id?: number) => void;
  getLastDelay: () => number;
  getLastRendered: () => number;
  setTimeout: (handler: Function, delay?: number) => number;
  triggerSound: () => void | Promise<void>;
};

export type BeatEngineOptions = {
  onBeatUpdate?: () => void;
  playMode: PlayMode;
  tempo: number;
};

export class BeatEngineCore {
  protected lastDelay = 0;
  protected lastRender = 0;
  protected nextTimeout: number | undefined;

  constructor(protected handlers: BeatEngineHandlers, public options: BeatEngineOptions) {}

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
    this.nextTimeout = this.handlers.setTimeout(() => {
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
