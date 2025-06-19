import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { PlayMode } from '../constants';
import { BeatEngineCore } from './beat-engine-core';

export type TimeoutElement = {
  id: number;
  delay?: number;
  handler: Function;
};

let beatEngine: BeatEngineTest;

export class BeatEngineTest extends BeatEngineCore {
  timeoutElements: TimeoutElement[] = [];

  currentLastRendered = 0;
  initializeYoutubePlayerCount = 0;
  mockedDelay = 0;
  nextTimeoutId = 1;
  onBeatUpdateCount = 0;
  onCountdownUpdateCount = 0;
  startPromise: undefined | Promise<void>;
  startYoutubeTrackCount = 0;

  constructor() {
    super({
      clearTimeout: (_id?: number) => {},
      getLastDelay: () => {
        return this.currentLastRendered + this.mockedDelay;
      },
      getLastRendered: () => {
        this.currentLastRendered += 100;
        return this.currentLastRendered;
      },
      initializeYoutubePlayer: () => {
        ++this.initializeYoutubePlayerCount;
        return Promise.resolve({
          playVideo: () => {},
          pauseVideo: () => {},
          seekTo: () => {},
          destroy: () => {},
          mute: () => {},
          unMute: () => {},
        } as unknown as YT.Player);
      },
      setTimeout: (handler: () => void, delay?: number) => {
        const id = this.nextTimeoutId++;
        this.timeoutElements.push({
          delay,
          handler,
          id,
        });
        return id;
      },
      startYoutubeTrack: () => {
        ++this.startYoutubeTrackCount;
        return Promise.resolve();
      },
      triggerSound: () => {},
    });
  }

  getLastRender() {
    return this.lastRender;
  }
}

Given(/a beat engine with tempo (\d+)/, function (tempo: number) {
  beatEngine = new BeatEngineTest();

  beatEngine.onBeatUpdate = () => {
    ++beatEngine.onBeatUpdateCount;
  };
  beatEngine.onCountdownUpdate = () => {
    ++beatEngine.onCountdownUpdateCount;
  };
  beatEngine.playMode = PlayMode.silent;
  beatEngine.tempo = tempo;
});

Given(/a render delay of (\d+)ms/, function (delay: number) {
  beatEngine.mockedDelay = delay;
});

When('a youtube track with id {string} at start {int}', function (videoId: string, start: number) {
  beatEngine.playMode = PlayMode.youtubeTrack;
  beatEngine.youtubeTrack = {
    videoId,
    start,
  };
});

When('starting to play', function () {
  beatEngine.startPromise = beatEngine.start();
});

When('starting to play with countdown {int}', function (countdown: number) {
  beatEngine.startPromise = beatEngine.start(countdown);
});

When('the beat engine is ready', async function () {
  await beatEngine.startPromise;
});

When('the schedule element {int} kicks in', function (beatNumber: number) {
  const timeoutElement = beatEngine.timeoutElements[beatNumber - 1];
  timeoutElement.handler();
});

Then('the onBeatUpdate handler has been called called {int} time\\(s)', function (count: number) {
  expect(count).to.equal(beatEngine.onBeatUpdateCount);
});

Then(
  'the onCountdownUpdate handler has been called called {int} time\\(s)',
  function (count: number) {
    expect(count).to.equal(beatEngine.onCountdownUpdateCount);
  },
);

Then(
  'the initializeYoutubePlayer handler has been called called {int} time\\(s)',
  function (count: number) {
    expect(count).to.equal(beatEngine.initializeYoutubePlayerCount);
  },
);

Then(
  'the startYoutubeTrack handler has been called called {int} time\\(s)',
  function (count: number) {
    expect(count).to.equal(beatEngine.startYoutubeTrackCount);
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
