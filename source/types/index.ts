import { CompassType } from '../constants';

export type ChordCompass = CompassBase & {
  frames: string[];
  strummingPatternIndex?: number;
  type: CompassType.chord;
};

export type Compass = ChordCompass | CompassReference | PickingCompass;

export type CompassBase = { index: number };

export type CompassReference = CompassBase & {
  reference: number;
  type: CompassType.reference;
};

export type PickingCompass = CompassBase & {
  frames: PickingFrame[];
  framesNumber: number;
  type: CompassType.picking;
};

export type PickingFrame = string[];

export type StrummingPattern = {
  frames: string[];
  framesNumber: number;
  index: number;
};

export type Tab = {
  compasses: Compass[];
  editIndex: number;
  id: string;
  strummingPatterns: StrummingPattern[];
  title: string;
};

export type TabRegistry = {
  [id: string]: string;
};
