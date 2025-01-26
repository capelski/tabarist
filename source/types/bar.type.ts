import {
  DiminishedBarBase,
  DiminishedChordBar,
  DiminishedPickingBar,
  DiminishedReferenceBar,
  DiminishedSectionBar,
} from './diminished-bar.type';
import { IndexedValue } from './indexed-value.type';

export type NonSectionBar = ChordBar | PickingBar | ReferenceBar;
export type Bar = NonSectionBar | SectionBar;

export type BarBase = DiminishedBarBase & {
  index: number;
};

export type ChordBar = BarBase &
  Omit<DiminishedChordBar, 'frames'> & {
    frames: IndexedValue[];
  };

export type PickingBar = BarBase &
  Omit<DiminishedPickingBar, 'frames'> & {
    framesNumber: number;
    frames: PickingFrame[];
  };

export type PickingFrame = {
  index: number;
  strings: IndexedValue[];
};

export type ReferenceBar = BarBase & DiminishedReferenceBar;

export type SectionBar = BarBase & DiminishedSectionBar;
