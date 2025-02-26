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
  Omit<DiminishedChordBar, 'slots'> & {
    slots: Slot[];
  };

export type PickingBar = BarBase &
  Omit<DiminishedPickingBar, 'chordSupport' | 'strings'> & {
    chordSupport: Slot[];
    strings: { index: number; slots: Slot[] }[];
  };

export type ReferenceBar = BarBase & DiminishedReferenceBar;

export type SectionBar = BarBase & DiminishedSectionBar;
