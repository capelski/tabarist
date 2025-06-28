import {
  addBarWidth,
  AddMode,
  barMinWidth,
  BarType,
  characterWidth,
  ContainerType,
  inputWidth,
  referenceColor,
  sectionColor,
  sectionNameMaxWidth,
} from '../constants';
import { Bar, BarContainer, ChordBar, PickingBar, SectionBar } from '../types';
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

const getBarWidth = (bar: ChordBar | PickingBar) => {
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

  return Math.max(width + addBarWidth, barMinWidth);
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
): ReducedBarContainers => {
  const barContainers: BarContainer[] = [];
  const isReference = type === ContainerType.sectionReferenceHead;
  const addToParent = isReference ? undefined : sectionBar;
  const backgroundColor = isReference ? (isEditMode ? referenceColor : 'white') : sectionColor;
  let nextChordBar = previousChordBar;

  barContainers.push({
    addToParent,
    backgroundColor,
    barIndex,
    canUpdate: !isReference,
    display: !!isEditMode,
    addMode: AddMode.none,
    displayControls: true,
    displayIndex: getDisplayIndex(barIndex, {
      referencedIndex: isReference ? sectionBar.index : undefined,
    }),
    isParent: true,
    repeats,
    sectionName: sectionBar.name,
    type,
    width: Math.min(
      Math.max(
        addBarWidth + inputWidth + (sectionBar.name?.length ?? 0) * characterWidth,
        barMinWidth,
      ),
      sectionNameMaxWidth,
    ),
  });

  if (sectionBar.bars.length > 0) {
    const childContainers = childBarsToBarContainers(
      sectionBar.bars,
      isEditMode,
      previousChordBar,
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

  barContainers.push({
    addToParent,
    appendBarIndex: barIndex,
    backgroundColor,
    barIndex,
    canUpdate: false,
    display: !!isEditMode,
    addMode: AddMode.none,
    displayControls: false,
    displayIndex: getDisplayIndex(barIndex) + 'tail',
    isParent: true,
    repeats: undefined,
    type: ContainerType.sectionTail,
    sectionName: '',
    width: 0,
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

  return {
    backgroundColor,
    canUpdate: isReference ? false : !options.parentIsReference,
    display: true,
    addMode: options.parentSection
      ? options.parentIsReference
        ? AddMode.none
        : AddMode.dual
      : AddMode.dualWithSection,
    displayControls: !options.parentSection || !options.parentIsReference,
    displayIndex: getDisplayIndex(barIndex, {
      parentIndex: options.parentIndex,
      referencedIndex: isReference ? bar.index : undefined,
    }),
    omitRhythm:
      bar.type === BarType.chord &&
      previousChordBar?.rhythmIndex !== undefined &&
      bar.rhythmIndex === previousChordBar?.rhythmIndex,
    barIndex,
    position: positionReference.value++,
    renderedBar: bar,
    repeats: isFirstInSectionBar && options.parentRepeats ? options.parentRepeats : repeats,
    type,
    width: getBarWidth(bar),
    ...(options.parentSection
      ? {
          addToParent: options.parentSection,
          firstSectionBarPosition: options.firstSectionBarPosition,
          isFirstInSectionBar,
          isLastInSectionBar,
          parentSection: options.parentSection,
          parentIndex: options.parentIndex,
        }
      : {
          firstSectionBarPosition: undefined,
        }),
  };
};

export const barToBarContainers = (
  bars: Bar[],
  bar: Bar,
  isEditMode: boolean | undefined,
  positionReference: { value: number },
  previousChordBar: ChordBar | undefined,
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
): BarContainer[] => {
  return childBarsToBarContainers(bars, isEditMode, undefined, {}).barContainers;
};
