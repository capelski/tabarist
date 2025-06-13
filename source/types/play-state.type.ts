import { PlayPhase } from '../constants';

export type PlayState =
  | {
      phase: PlayPhase.initializing;
    }
  | {
      phase: PlayPhase.paused;
    }
  | {
      phase: PlayPhase.playing;
    }
  | {
      phase: PlayPhase.resuming;
    }
  | {
      phase: PlayPhase.stopping;
    };
