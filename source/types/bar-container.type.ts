import { AddMode, ContainerDiscriminator, ContainerType } from '../constants';
import { ChordBar, PickingBar, SectionBar } from './bar.type';

export type ContainerBase<TContainer extends ContainerType> = {
  addMode: AddMode;
  backgroundColor: string;
  barIndex: number;
  canUpdate: boolean;
  discriminator: ContainerDiscriminator;
  display: boolean;
  displayControls: boolean;
  displayIndex: string;
  displayRepeats: boolean;
  isOperationSource: boolean;
  parentIndex: number | undefined;
  repeatsBarIndex: number | undefined;
  repeatsValue: number | undefined;
  sectionName?: string;
  type: TContainer;
  width: number;
} & (
  | {
      destinationBarIndex: number;
      destinationParentSection: SectionBar | undefined;
      isOperationTarget: true;
    }
  | {
      destinationBarIndex?: undefined;
      destinationParentSection?: undefined;
      isOperationTarget: false;
    }
);

export type ChildBarBase<T extends ChordBar | PickingBar> = {
  isParent?: undefined;
  omitRhythm: boolean;
  position: number;
  renderedBar: T;
} & (
  | {
      addToParent?: undefined;
      firstSectionBarPosition?: undefined;
      isFirstInSectionBar?: undefined;
      isLastInSectionBar?: undefined;
      parentSection?: undefined;
    }
  | {
      addToParent: SectionBar;
      /** Used to find the position of the first bar of a section when repeating the active slot */
      firstSectionBarPosition: number;
      isFirstInSectionBar: boolean;
      isLastInSectionBar: boolean;
      parentSection: SectionBar;
    }
);

export type ParentBarBase = {
  addToParent: SectionBar | undefined;
  firstSectionBarPosition?: undefined;
  isFirstInSectionBar?: undefined;
  isLastInSectionBar?: undefined;
  isParent: true;
  parentSection?: undefined;
  position?: undefined;
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
      : TContainer extends ContainerType.sectionHead
      ? ParentBarBase
      : TContainer extends ContainerType.sectionReferenceHead
      ? ParentBarBase
      : TContainer extends ContainerType.sectionTail
      ? SectionTailContainer
      : {});
