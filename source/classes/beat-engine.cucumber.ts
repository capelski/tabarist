import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { BeatEngineCore, BeatEngineMode, BeatEnginePhase } from './beat-engine-core';

type Schedule = {
  delay?: number;
  handler: Function;
  id: number;
};

type SchedulesCollection = {
  nextId: number;
  schedules: Schedule[];
};

let beatEngine: BeatEngineTest;

const addSchedule = (collection: SchedulesCollection, handler: () => void, delay?: number) => {
  const id = collection.nextId++;
  collection.schedules.push({
    delay,
    handler,
    id,
  });
  return id;
};

export class BeatEngineTest extends BeatEngineCore {
  beatSchedules: SchedulesCollection = { nextId: 1, schedules: [] };
  countdownSchedules: SchedulesCollection = { nextId: 1, schedules: [] };
  trackStartSchedules: SchedulesCollection = { nextId: 1, schedules: [] };

  currentLastRendered = 0;
  initializeYoutubePlayerCount = 0;
  mockedDelay = 0;
  onBeatUpdateCount = 0;
  onCountdownUpdateCount = 0;
  startPromise: undefined | Promise<void>;
  startYoutubeTrackCount = 0;

  initializeYoutubePlayerResolver: undefined | ((player: YT.Player) => void);
  startYoutubeTrackResolver: undefined | (() => void);

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
        return new Promise((resolve) => {
          this.initializeYoutubePlayerResolver = resolve;
        });
      },
      scheduleBeat: (handler, delay) => addSchedule(this.beatSchedules, handler, delay),
      scheduleCountdown: (handler, delay) => addSchedule(this.countdownSchedules, handler, delay),
      scheduleTrackStart: (handler, delay) => addSchedule(this.trackStartSchedules, handler, delay),
      startYoutubeTrack: () => {
        ++this.startYoutubeTrackCount;
        return new Promise((resolve) => {
          this.startYoutubeTrackResolver = resolve;
        });
      },
      triggerSound: () => {},
    });
  }

  getLastRender() {
    return this.lastRender;
  }

  getPhase() {
    return this.phase;
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
  beatEngine.mode = BeatEngineMode.silent;
  beatEngine.tempo = tempo;
});

Given(/a render delay of (\d+)ms/, function (delay: number) {
  beatEngine.mockedDelay = delay;
});

When('a youtube track with id {string} at start {int}', function (videoId: string, start: number) {
  beatEngine.mode = BeatEngineMode.youtubeTrack;
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

When('the scheduled beat {int} kicks in', function (scheduleIndex: number) {
  const timeoutElement = beatEngine.beatSchedules.schedules[scheduleIndex - 1];
  timeoutElement.handler();
});

When('the scheduled countdown {int} kicks in', function (scheduleIndex: number) {
  const timeoutElement = beatEngine.countdownSchedules.schedules[scheduleIndex - 1];
  timeoutElement.handler();
});

When('the scheduled track start {int} kicks in', function (scheduleIndex: number) {
  const timeoutElement = beatEngine.trackStartSchedules.schedules[scheduleIndex - 1];
  timeoutElement.handler();
});

When('the youtube player is initialized', function () {
  beatEngine.initializeYoutubePlayerResolver!({
    playVideo: () => {},
    pauseVideo: () => {},
    seekTo: () => {},
    destroy: () => {},
    mute: () => {},
    unMute: () => {},
  } as unknown as YT.Player);
});

When('the youtube track starts', function () {
  beatEngine.startYoutubeTrackResolver!();
});

When('stopping the beat engine', function () {
  beatEngine.stop();
});

Then('the beat engine is in phase {string}', function (phase: BeatEnginePhase) {
  expect(beatEngine.getPhase()).to.equal(phase);
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
  'beat schedule {int} is set with delay {int}ms',
  function (scheduleElement: number, delay: number) {
    const timeoutElement = beatEngine.beatSchedules.schedules[scheduleElement - 1];
    expect(timeoutElement.delay).to.equal(delay);
  },
);

Then(
  'countdown schedule {int} is set with delay {int}ms',
  function (scheduleElement: number, delay: number) {
    const timeoutElement = beatEngine.countdownSchedules.schedules[scheduleElement - 1];
    expect(timeoutElement.delay).to.equal(delay);
  },
);

Then(
  'track start schedule {int} is set with delay {int}ms',
  function (scheduleElement: number, delay: number) {
    const timeoutElement = beatEngine.trackStartSchedules.schedules[scheduleElement - 1];
    expect(timeoutElement.delay).to.equal(delay);
  },
);
