import { BarType } from '../constants';
import { DiminishedSlot } from './diminished-slot.type';

export type DiminishedNonSectionBar =
  | DiminishedChordBar
  | DiminishedPickingBar
  | DiminishedReferenceBar;
export type DiminishedBar = DiminishedNonSectionBar | DiminishedSectionBar;

export type DiminishedBarBase = {
  repeats: number | undefined;
};

export type DiminishedChordBar = DiminishedBarBase & {
  rhythmIndex: number;
  slots: DiminishedSlot[];
  type: BarType.chord;
};

export type DiminishedPickingBar = DiminishedBarBase & {
  chordSupport: DiminishedSlot[];
  strings: { slots: DiminishedSlot[] }[];
  type: BarType.picking;
};

export type DiminishedReferenceBar = DiminishedBarBase & {
  barIndex: number;
  type: BarType.reference;
};

export type DiminishedSectionBar = DiminishedBarBase & {
  bars: DiminishedNonSectionBar[];
  name: string;
  type: BarType.section;
};
