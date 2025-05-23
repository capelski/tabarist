import {
  DiminishedBarBase,
  DiminishedChordBar,
  DiminishedPickingBar,
  DiminishedReferenceBar,
  DiminishedSectionBar,
} from './diminished-bar.type';
import { Slot } from './slot.type';

export type NonSectionBar = ChordBar | PickingBar | ReferenceBar;
export type Bar = NonSectionBar | SectionBar;

export type BarBase = DiminishedBarBase & {
  index: number;
};

export type ChordBar = BarBase &
  Omit<DiminishedChordBar, 'rhythmIndex' | 'rhythmSlots' | 'slots'> & {
    slots: Slot[];
  } & (
    | {
        rhythmIndex: number;
        rhythmSlots?: undefined;
      }
    | {
        rhythmIndex?: undefined;
        rhythmSlots: Slot[];
      }
  );

export type PickingBar = BarBase &
  Omit<DiminishedPickingBar, 'chordSupport' | 'strings'> & {
    chordSupport: Slot[];
    strings: { index: number; slots: Slot[] }[];
  };

export type ReferenceBar = BarBase & DiminishedReferenceBar;

export type SectionBar = BarBase &
  Omit<DiminishedSectionBar, 'bars'> & {
    bars: NonSectionBar[];
  };
