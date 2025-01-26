import { BarType } from '../constants';

export type DiminishedNonSectionBar =
  | DiminishedChordBar
  | DiminishedPickingBar
  | DiminishedReferenceBar;
export type DiminishedBar = DiminishedNonSectionBar | DiminishedSectionBar;

export type DiminishedBarBase = {
  repeats?: number;
};

export type DiminishedChordBar = DiminishedBarBase & {
  frames: string[];
  /** Strumming pattern index */
  sPatternIndex: number;
  type: BarType.chord;
};

export type DiminishedPickingBar = DiminishedBarBase & {
  frames: { strings: string[] }[];
  type: BarType.picking;
};

export type DiminishedReferenceBar = DiminishedBarBase & {
  barIndex: number;
  type: BarType.reference;
};

export type DiminishedSectionBar = DiminishedBarBase & {
  sectionIndex: number;
  type: BarType.section;
};
