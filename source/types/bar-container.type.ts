import { Bar, ChordBar, PickingBar, SectionBar } from './bar.type';

export type BarContainer<
  TBar extends ChordBar | PickingBar | SectionBar = ChordBar | PickingBar | SectionBar,
> = {
  displayIndex: string;
  isFirstInSectionBar: boolean;
  isLastInSectionBar: boolean;
  isReference: boolean;
  omitRhythm: boolean;
  originalBar: Bar;
  originalIndex: number;
  parentIsReference: boolean | undefined;
  parentSection: SectionBar | undefined;
  position: number;
  /** Used to find the position of the first bar of a section when repeating the active slot */
  positionOfFirstBar: number | undefined;
  /** An undefined value is used to represent a section bar for a section with no bars */
  renderedBar: TBar extends SectionBar ? undefined : TBar;
  repeats?: number;
  width: number;
};
