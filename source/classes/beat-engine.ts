import clickSound from '../assets/click.mp3';
import { BeatEngineCore, BeatEngineOptions } from './beat-engine-core';

const clickAudio = typeof Audio !== 'undefined' ? new Audio(clickSound) : undefined;

export class BeatEngine extends BeatEngineCore {
  constructor(public options: BeatEngineOptions) {
    super(
      {
        clearTimeout: window.clearTimeout.bind(window),
        getLastDelay: Date.now.bind(Date),
        getLastRendered: Date.now.bind(Date),
        setTimeout: window.setTimeout.bind(window),
        triggerSound: () => clickAudio?.play(),
      },
      options,
    );
  }
}
