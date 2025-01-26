import { BarType } from '../constants';

export type DiminishedNonSectionBar =
  | DiminishedChordBar
  | DiminishedPickingBar
  | DiminishedReferenceBar;
export type DiminishedBar = DiminishedNonSectionBar | DiminishedSectionBar;

export type DiminishedBarBase = {
  repeats: number | undefined;
};

export type DiminishedChordBar = DiminishedBarBase & {
  frames: string[];
  /** Strumming pattern index */
  sPatternIndex: number;
  type: BarType.chord;
};

export type DiminishedPickingBar = DiminishedBarBase & {
  frames: DiminishedPickingFrame[];
  type: BarType.picking;
};

export type DiminishedPickingFrame = {
  chordSupport: string | undefined;
  strings: string[];
};

export type DiminishedReferenceBar = DiminishedBarBase & {
  barIndex: number;
  type: BarType.reference;
};

export type DiminishedSectionBar = DiminishedBarBase & {
  sectionIndex: number;
  type: BarType.section;
};
