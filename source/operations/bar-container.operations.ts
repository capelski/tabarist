import {
  addBarWidth,
  AddMode,
  barMinWidth,
  BarType,
  characterWidth,
  ContainerDiscriminator,
  ContainerType,
  inputWidth,
  referenceColor,
  sectionCharacterWidth,
  sectionColor,
  sectionControlsWidth,
} from '../constants';
import { Bar, BarContainer, ChordBar, PickingBar, PositionOperation, SectionBar } from '../types';
import { barOperations } from './bar.operations';
import { getIndexDisplayValue } from './indexed-value.operations';
import { slotOperations } from './slot.operations';

export type ReducedBarContainers = {
  barContainers: BarContainer[];
  previousChordBar: ChordBar | undefined;
};

type ChildBarOptions = {
  firstSectionBarPosition: number;
  positionReference: { value: number };
  parentIndex: number;
  parentIsReference: boolean;
  parentRepeats?: number;
  parentSection: SectionBar;
};

type ContainerBarOptions =
  | {
      firstSectionBarPosition?: undefined;
      positionReference?: undefined;
      parentIndex?: undefined;
      parentIsReference?: undefined;
      parentRepeats?: number;
      parentSection?: undefined;
    }
  | ChildBarOptions;

const getBarWidth = (bar: ChordBar | PickingBar, sectionName: string | undefined) => {
  const width =
    bar.type === BarType.chord
      ? bar.slots.reduce((barReduced, slot) => {
          return barReduced + slotOperations.getSlotLength(slot);
        }, 0)
      : [bar.chordSupport, ...bar.strings.map((string) => string.slots)].reduce(
          (barReduced, slots) => {
            return Math.max(
              barReduced,
              slots.reduce((reduced, slot) => {
                return reduced + slotOperations.getSlotLength(slot, inputWidth);
              }, 0),
            );
          },
          0,
        );

  const widthWithSectionName =
    sectionName !== undefined
      ? Math.max(width, sectionName.length * sectionCharacterWidth + sectionControlsWidth)
      : width;

  return Math.max(widthWithSectionName + addBarWidth, barMinWidth);
};

const getDisplayIndex = (
  barIndex: number,
  options: { parentIndex?: number; referencedIndex?: number } = {},
) => {
  const base =
    options.parentIndex !== undefined
      ? `${getIndexDisplayValue(options.parentIndex)}.${getIndexDisplayValue(barIndex)}`
      : `${getIndexDisplayValue(barIndex)}`;

  const displayReferredIndex =
    options.referencedIndex !== undefined
      ? getIndexDisplayValue(options.referencedIndex)
      : undefined;

  const displayIndex = displayReferredIndex
    ? `${base}=${
        options.parentIndex !== undefined
          ? `${getIndexDisplayValue(options.parentIndex)}.${displayReferredIndex}`
          : displayReferredIndex
      }`
    : base;

  return displayIndex;
};

const processParentBar = (
  isEditMode: boolean | undefined,
  barIndex: number,
  sectionBar: SectionBar,
  positionReference: { value: number },
  type: ContainerType.sectionHead | ContainerType.sectionReferenceHead,
  repeats: number | undefined,
  previousChordBar: ChordBar | undefined,
  positionOperation: PositionOperation | undefined,
): ReducedBarContainers => {
  const barContainers: BarContainer[] = [];
  const isEmpty = sectionBar.bars.length === 0;
  const isReference = type === ContainerType.sectionReferenceHead;
  const addToParent = isReference ? undefined : sectionBar;
  const backgroundColor = isEditMode ? (isReference ? referenceColor : sectionColor) : 'white';
  let nextChordBar = previousChordBar;

  const isOperationTargetHead =
    !!positionOperation &&
    !positionOperation.sectionIndex &&
    barOperations.canMoveBarToPosition(positionOperation.startIndex, barIndex);

  barContainers.push({
    addMode: AddMode.none,
    addToParent,
    backgroundColor,
    barIndex,
    canUpdate: !isReference,
    discriminator: isReference
      ? isEmpty
        ? ContainerDiscriminator.mirror_head_empty
        : ContainerDiscriminator.mirror_head
      : isEmpty
      ? ContainerDiscriminator.section_head_empty
      : ContainerDiscriminator.section_head,
    display: !!isEditMode && sectionBar.bars.length === 0,
    displayControls: true,
    displayIndex: getDisplayIndex(barIndex, {
      referencedIndex: isReference ? sectionBar.index : undefined,
    }),
    displayRepeats: false,
    isOperationSource:
      !!positionOperation &&
      !positionOperation.sectionIndex &&
      positionOperation.startIndex === barIndex,
    isParent: true,
    parentIndex: undefined,
    repeatsBarIndex: undefined,
    repeatsValue: undefined,
    sectionName: sectionBar.name,
    sectionNameBarIndex: barIndex,
    type,
    width: Math.max(
      addBarWidth + inputWidth + (sectionBar.name?.length ?? 0) * characterWidth,
      barMinWidth,
    ),
    ...(isOperationTargetHead
      ? {
          destinationBarIndex: barIndex,
          destinationParentSection: undefined,
          isOperationTarget: isOperationTargetHead,
        }
      : {
          destinationBarIndex: undefined,
          destinationParentSection: undefined,
          isOperationTarget: isOperationTargetHead,
        }),
  });

  if (!isEmpty) {
    const childContainers = childBarsToBarContainers(
      sectionBar.bars,
      isEditMode,
      previousChordBar,
      positionOperation,
      {
        firstSectionBarPosition: positionReference.value,
        positionReference,
        parentIndex: barIndex,
        parentIsReference: isReference,
        parentSection: sectionBar,
        parentRepeats: repeats,
      },
    );
    barContainers.push(...childContainers.barContainers);
    nextChordBar = childContainers.previousChordBar;
  }

  const isOperationTargetTail =
    !!positionOperation &&
    positionOperation.sectionIndex === barIndex &&
    positionOperation.startIndex !== sectionBar.bars.length - 1;

  barContainers.push({
    addMode: AddMode.none,
    addToParent,
    appendBarIndex: barIndex,
    backgroundColor,
    barIndex,
    canUpdate: false,
    discriminator: isReference
      ? ContainerDiscriminator.mirror_tail
      : ContainerDiscriminator.section_tail,
    display: !!isEditMode,
    displayControls: false,
    displayIndex: getDisplayIndex(barIndex) + 'tail',
    displayRepeats: false,
    isOperationSource: false,
    isParent: true,
    parentIndex: undefined,
    repeatsBarIndex: undefined,
    repeatsValue: undefined,
    sectionName: undefined,
    sectionNameBarIndex: undefined,
    type: ContainerType.sectionTail,
    width: 0,
    ...(isOperationTargetTail
      ? {
          destinationBarIndex: barIndex,
          destinationParentSection: undefined,
          isOperationTarget: isOperationTargetTail,
        }
      : {
          destinationBarIndex: undefined,
          destinationParentSection: undefined,
          isOperationTarget: isOperationTargetTail,
        }),
  });

  return { barContainers, previousChordBar: nextChordBar };
};

const processChildBar = (
  bar: ChordBar | PickingBar,
  barIndex: number,
  isEditMode: boolean | undefined,
  type: ContainerType.chord | ContainerType.picking | ContainerType.reference,
  bars: Bar[],
  positionReference: { value: number },
  previousChordBar: ChordBar | undefined,
  positionOperation: PositionOperation | undefined,
  repeats?: number,
  options: ContainerBarOptions = {},
): BarContainer => {
  const isReference = type === ContainerType.reference;
  const isFirstInSectionBar = !!options.parentSection && barIndex === 0;
  const isLastInSectionBar = !!options.parentSection && barIndex === bars.length - 1;

  let backgroundColor = 'white';

  if (isEditMode && options.parentSection) {
    backgroundColor = options.parentIsReference ? referenceColor : sectionColor;
  } else if (isEditMode && isReference) {
    backgroundColor = referenceColor;
  } else if (!isEditMode && options.parentSection) {
    backgroundColor = sectionColor;
  }

  const isOperationTarget =
    !!positionOperation &&
    ((positionOperation.sectionIndex === options.parentIndex &&
      barOperations.canMoveBarToPosition(positionOperation.startIndex, barIndex)) ||
      (positionOperation.sectionIndex === undefined &&
        isFirstInSectionBar &&
        barOperations.canMoveBarToPosition(positionOperation.startIndex, options.parentIndex)));
  const sectionName = isFirstInSectionBar ? options.parentSection.name : undefined;

  return {
    addMode: options.parentSection
      ? options.parentIsReference
        ? AddMode.none
        : AddMode.dual
      : AddMode.dualWithSection,
    backgroundColor,
    barIndex,
    canUpdate: isReference ? false : !options.parentIsReference,
    discriminator: isReference
      ? options.parentSection
        ? options.parentIsReference
          ? isFirstInSectionBar
            ? ContainerDiscriminator.reference_mirror_child_first
            : ContainerDiscriminator.reference_mirror_child
          : isFirstInSectionBar
          ? ContainerDiscriminator.reference_section_child_first
          : ContainerDiscriminator.reference_section_child
        : ContainerDiscriminator.reference_standalone
      : options.parentSection
      ? options.parentIsReference
        ? isFirstInSectionBar
          ? ContainerDiscriminator.core_mirror_child_first
          : ContainerDiscriminator.core_mirror_child
        : isFirstInSectionBar
        ? ContainerDiscriminator.core_section_child_first
        : ContainerDiscriminator.core_section_child
      : ContainerDiscriminator.core_standalone,
    display: true,
    displayControls: !options.parentSection || !options.parentIsReference || isFirstInSectionBar,
    displayIndex: getDisplayIndex(barIndex, {
      parentIndex: options.parentIndex,
      referencedIndex: isReference ? bar.index : undefined,
    }),
    displayRepeats: !options.parentSection || isFirstInSectionBar,
    isOperationSource:
      !!positionOperation &&
      ((positionOperation.sectionIndex === options.parentIndex &&
        positionOperation.startIndex === barIndex) ||
        (positionOperation.sectionIndex === undefined &&
          isFirstInSectionBar &&
          positionOperation.startIndex === options.parentIndex)),
    omitRhythm:
      bar.type === BarType.chord &&
      previousChordBar?.rhythmIndex !== undefined &&
      bar.rhythmIndex === previousChordBar?.rhythmIndex,
    parentIndex: options.parentIndex,
    position: positionReference.value++,
    renderedBar: bar,
    repeatsBarIndex: options.parentSection
      ? isFirstInSectionBar
        ? options.parentIndex
        : undefined
      : barIndex,
    repeatsValue: options.parentSection
      ? isFirstInSectionBar
        ? options.parentRepeats
        : undefined
      : repeats,
    type,
    width: getBarWidth(bar, sectionName),
    ...(isOperationTarget
      ? {
          destinationBarIndex:
            isFirstInSectionBar && positionOperation?.sectionIndex === undefined
              ? options.parentIndex
              : barIndex,
          destinationParentSection:
            isFirstInSectionBar && positionOperation?.sectionIndex === undefined
              ? undefined
              : options.parentSection,
          isOperationTarget,
        }
      : {
          destinationBarIndex: undefined,
          destinationParentSection: undefined,
          isOperationTarget,
        }),
    ...(options.parentSection
      ? {
          addToParent: options.parentSection,
          firstSectionBarPosition: options.firstSectionBarPosition,
          isFirstInSectionBar,
          isLastInSectionBar,
          parentSection: options.parentSection,
        }
      : {
          firstSectionBarPosition: undefined,
        }),
    ...(isFirstInSectionBar
      ? {
          sectionName: options.parentSection.name,
          sectionNameBarIndex: options.parentSection.index,
        }
      : { sectionName: undefined, sectionNameBarIndex: undefined }),
  };
};

export const barToBarContainers = (
  bars: Bar[],
  bar: Bar,
  isEditMode: boolean | undefined,
  positionReference: { value: number },
  previousChordBar: ChordBar | undefined,
  positionOperation: PositionOperation | undefined,
  options: ContainerBarOptions = {},
): ReducedBarContainers => {
  let nextChordBar = previousChordBar;
  const barContainers: BarContainer[] = [];

  if (bar.type === BarType.chord || bar.type === BarType.picking) {
    barContainers.push(
      processChildBar(
        bar,
        bar.index,
        isEditMode,
        bar.type === BarType.chord ? ContainerType.chord : ContainerType.picking,
        bars,
        positionReference,
        previousChordBar,
        positionOperation,
        bar.repeats,
        options,
      ),
    );

    if (bar.type === BarType.chord) {
      nextChordBar = bar;
    }
  } else if (bar.type === BarType.reference) {
    const referencedBar = bars.find((b) => b.index === bar.barIndex) as
      | ChordBar
      | PickingBar
      | SectionBar;

    if (referencedBar.type === BarType.chord || referencedBar.type === BarType.picking) {
      barContainers.push(
        processChildBar(
          referencedBar,
          bar.index,
          isEditMode,
          ContainerType.reference,
          bars,
          positionReference,
          previousChordBar,
          positionOperation,
          bar.repeats,
          options,
        ),
      );
    } else {
      const childContainers = processParentBar(
        isEditMode,
        bar.index,
        referencedBar,
        positionReference,
        ContainerType.sectionReferenceHead,
        bar.repeats,
        previousChordBar,
        positionOperation,
      );
      barContainers.push(...childContainers.barContainers);
      nextChordBar = childContainers.previousChordBar;
    }

    if (referencedBar.type === BarType.chord) {
      nextChordBar = referencedBar;
    }
  } else {
    const childContainers = processParentBar(
      isEditMode,
      bar.index,
      bar,
      positionReference,
      ContainerType.sectionHead,
      bar.repeats,
      previousChordBar,
      positionOperation,
    );
    barContainers.push(...childContainers.barContainers);
    nextChordBar = childContainers.previousChordBar;
  }

  return {
    barContainers,
    previousChordBar: nextChordBar,
  };
};

const childBarsToBarContainers = (
  bars: Bar[],
  isEditMode: boolean | undefined,
  previousChordBar: ChordBar | undefined,
  positionOperation: PositionOperation | undefined,
  options: ContainerBarOptions = {},
): ReducedBarContainers => {
  const positionReference = options.positionReference || { value: 0 };
  const result = bars.reduce<ReducedBarContainers>(
    (reduced, bar) => {
      const currentBarContainers = barToBarContainers(
        bars,
        bar,
        isEditMode,
        positionReference,
        reduced.previousChordBar,
        positionOperation,
        options,
      );

      return {
        barContainers: [...reduced.barContainers, ...currentBarContainers.barContainers],
        previousChordBar: currentBarContainers.previousChordBar,
      };
    },
    { barContainers: [], previousChordBar },
  );

  // console.log('barContainers', result.barContainers);

  return result;
};

export const barsToBarContainers = (
  bars: Bar[],
  isEditMode: boolean | undefined,
  positionOperation?: PositionOperation,
): BarContainer[] => {
  return childBarsToBarContainers(bars, isEditMode, undefined, positionOperation, {}).barContainers;
};
