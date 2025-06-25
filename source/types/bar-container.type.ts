import { ContainerType } from '../constants';
import { ChordBar, PickingBar, SectionBar } from './bar.type';

export type ContainerBase<TContainer extends ContainerType> = {
  backgroundColor: string;
  barIndex: number;
  canUpdate: boolean;
  display: boolean;
  displayAddButton: boolean;
  displayControls: boolean;
  displayIndex: string;
  repeats: number | undefined;
  type: TContainer;
  width: number;
};

export type ChildBarBase<T extends ChordBar | PickingBar> = {
  isParent?: undefined;
  omitRhythm: boolean;
  position: number;
  renderedBar: T;
  sectionName?: undefined;
} & (
  | {
      addToParent?: undefined;
      firstSectionBarPosition?: undefined;
      isFirstInSectionBar?: undefined;
      isLastInSectionBar?: undefined;
      parentIndex?: undefined;
      parentSection?: undefined;
    }
  | {
      addToParent: SectionBar;
      /** Used to find the position of the first bar of a section when repeating the active slot */
      firstSectionBarPosition: number;
      isFirstInSectionBar: boolean;
      isLastInSectionBar: boolean;
      parentIndex: number;
      parentSection: SectionBar;
    }
);

export type ParentBarBase = {
  addToParent: SectionBar | undefined;
  firstSectionBarPosition?: undefined;
  isFirstInSectionBar?: undefined;
  isLastInSectionBar?: undefined;
  isParent: true;
  parentIndex?: undefined;
  parentSection?: undefined;
  position?: undefined;
  sectionName: string;
};

export type SectionTailContainer = ParentBarBase & {
  appendBarIndex: number;
};

export type BarContainer<TContainer extends ContainerType = ContainerType> =
  ContainerBase<TContainer> &
    (TContainer extends ContainerType.chord
      ? ChildBarBase<ChordBar>
      : TContainer extends ContainerType.picking
      ? ChildBarBase<PickingBar>
      : TContainer extends ContainerType.reference
      ? ChildBarBase<ChordBar | PickingBar>
      : TContainer extends ContainerType.section
      ? ParentBarBase
      : TContainer extends ContainerType.sectionReference
      ? ParentBarBase
      : TContainer extends ContainerType.sectionTail
      ? SectionTailContainer
      : {});
