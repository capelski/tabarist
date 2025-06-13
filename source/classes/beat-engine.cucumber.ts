import { Before, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlayMode } from '../constants';
import { BeatEngineCore, BeatEngineOptions } from './beat-engine-core';

export type TimeoutElement = {
  id: number;
  delay?: number;
  handler: Function;
};

let beatEngine: BeatEngineTest;
let beforeStartCount: number;
let mockedDelay = 0;
let onBeatUpdateCount: number;
let onCountdownUpdateCount: number;

export class BeatEngineTest extends BeatEngineCore {
  timeoutElements: TimeoutElement[] = [];

  static currentLastRendered = 0;
  static nextTimeoutId = 1;

  constructor(public options: BeatEngineOptions) {
    super(
      {
        clearTimeout: (_id?: number) => {},
        getLastDelay: () => {
          return BeatEngineTest.currentLastRendered + mockedDelay;
        },
        getLastRendered: () => {
          BeatEngineTest.currentLastRendered += 100;
          return BeatEngineTest.currentLastRendered;
        },
        setTimeout: (handler: Function, delay?: number) => {
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

  getLastRender() {
    return this.lastRender;
  }
}

Before(() => {
  BeatEngineTest.currentLastRendered = 0;
  BeatEngineTest.nextTimeoutId = 1;
  beforeStartCount = 0;
  mockedDelay = 0;
  onBeatUpdateCount = 0;
  onCountdownUpdateCount = 0;
});

Given(/a beat engine with tempo (\d+)/, function (tempo: number) {
  beatEngine = new BeatEngineTest({
    beforeStart: () => {
      ++beforeStartCount;
    },
    onBeatUpdate: () => {
      ++onBeatUpdateCount;
    },
    onCountdownUpdate: () => {
      ++onCountdownUpdateCount;
    },
    playMode: PlayMode.silent,
    tempo,
  });
});

Given(/a render delay of (\d+)ms/, function (delay: number) {
  mockedDelay = delay;
});

When('starting to play', async function () {
  await beatEngine.start();
});

When('starting to play with countdown {int}', async function (countdown: number) {
  await beatEngine.start(countdown);
});

When('the schedule element {int} kicks in', function (beatNumber: number) {
  const timeoutElement = beatEngine.timeoutElements[beatNumber - 1];
  timeoutElement.handler();
});

Then('the beforeStart handler has been called called {int} time\\(s)', function (count: number) {
  expect(count).to.equal(beforeStartCount);
});

Then('the onBeatUpdate handler has been called called {int} time\\(s)', function (count: number) {
  expect(count).to.equal(onBeatUpdateCount);
});

Then(
  'the onCountdownUpdate handler has been called called {int} time\\(s)',
  function (count: number) {
    expect(count).to.equal(onCountdownUpdateCount);
  },
);

Then('the last rendered date is set to timestamp {int}', function (lastRendered: number) {
  expect(beatEngine.getLastRender()).to.equal(lastRendered);
});

Then(
  'beat {int} is scheduled via timeout {int} within {int}ms',
  function (beatNumber: number, timeoutId: number, delay: number) {
    // Subtracting 2; one to turn the number into a zero-based index, and another one
    // because the first beat doesn't schedule a timeout
    const timeoutElement = beatEngine.timeoutElements[beatNumber - 2];

    expect(timeoutElement.id).to.equal(timeoutId);
    expect(timeoutElement.delay).to.equal(delay);
  },
);
