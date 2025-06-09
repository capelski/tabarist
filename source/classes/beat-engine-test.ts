import { BeatEngineCore, BeatEngineOptions } from './beat-engine-core';

export type TimeoutElement = {
  id: number;
  delay?: number;
  handler: TimerHandler;
};

export class BeatEngineTest extends BeatEngineCore {
  protected timeoutElements: TimeoutElement[] = [];

  static nextTimeoutId = 1;
  static nextTimestamp = 1;

  constructor(public options: BeatEngineOptions) {
    super(
      {
        clearTimeout: (id?: number) => {
          if (id) {
            const index = this.timeoutElements.findIndex((t) => t.id === id);
            if (index !== -1) {
              this.timeoutElements.splice(index, 1);
            }
          }
        },
        getCurrentTimestamp: () => BeatEngineTest.nextTimestamp++,
        setTimeout: (handler: TimerHandler, delay?: number) => {
          const id = BeatEngineTest.nextTimeoutId++;
          this.timeoutElements.push({
            delay,
            handler,
            id,
          });
          return id;
        },
        triggerSound: () => {},
      },
      options,
    );
  }
}
