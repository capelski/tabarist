import { Bar, ChordBar, PickingBar, SectionBar } from './bar.type';
import { Section } from './section.type';

export type BarContainer<
  TBar extends ChordBar | PickingBar | SectionBar = ChordBar | PickingBar | SectionBar,
> = {
  inSection: Section | undefined;
  inSectionBar:
    | undefined
    | {
        bar: SectionBar;
        referredSection: Section;
      };
  isFirstInSectionBar: boolean;
  isLastInSectionBar: boolean;
  isReference: boolean;
  omitStrummingPattern: boolean;
  originalBar: Bar;
  position: number;
  /** Used to find the position of the first bar of a section when repeating the active frame */
  positionOfFirstBar: number | undefined;
  /** An undefined value is used to represent a section bar for a section with no bars */
  renderedBar: TBar extends SectionBar ? undefined : TBar;
};
