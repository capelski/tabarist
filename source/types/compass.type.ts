import { BarType } from '../constants';
import { IndexedValue } from './indexed-value.type';

export type ChordCompass = CompassBase & {
  frames: IndexedValue[];
  /** Strumming pattern index */
  sPatternIndex?: number;
  type: BarType.chord;
};

export type Compass = ChordCompass | PickingCompass | ReferenceCompass;

export type CompassBase = { index: number };

export type PickingCompass = CompassBase & {
  frames: PickingFrame[];
  framesNumber: number;
  type: BarType.picking;
};

export type ReferenceCompass = CompassBase & {
  compassIndex: number;
  type: BarType.reference;
};

export type PickingFrame = {
  index: number;
  strings: IndexedValue[];
};
