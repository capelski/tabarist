import { BarType } from '../constants';
import { IndexedValue } from './indexed-value.type';

export type Bar = ChordBar | PickingBar | ReferenceBar;

export type BarBase = { index: number };

export type ChordBar = BarBase & {
  frames: IndexedValue[];
  /** Strumming pattern index */
  sPatternIndex?: number;
  type: BarType.chord;
};

export type PickingBar = BarBase & {
  frames: PickingFrame[];
  framesNumber: number;
  type: BarType.picking;
};

export type PickingFrame = {
  index: number;
  strings: IndexedValue[];
};

export type ReferenceBar = BarBase & {
  barIndex: number;
  type: BarType.reference;
};
