import { PlayPhase } from '../constants';

export type PlayState =
  | {
      phase: PlayPhase.countdown;
      remaining: number;
    }
  | {
      phase: PlayPhase.loadingYoutube;
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
