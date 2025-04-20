import {
  addBarWidth,
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

  const displayReferredIndex = options.referencedIndex
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
  barContainers: BarContainer[],
  isEditMode: boolean,
  barIndex: number,
  sectionBar: SectionBar,
  positionReference: { value: number },
  type: ContainerType.section | ContainerType.sectionReference,
  repeats?: number,
) => {
  const isReference = type === ContainerType.sectionReference;

  if (isEditMode) {
    barContainers.push({
      addToParent: sectionBar,
      backgroundColor: isReference ? referenceColor : sectionColor,
      barIndex,
      canUpdate: !isReference,
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
  }

  if (sectionBar.bars.length > 0) {
    barContainers.push(
      ...barsToBarContainers(sectionBar.bars, isEditMode, {
        firstSectionBarPosition: positionReference.value,
        positionReference,
        parentIndex: barIndex,
        parentIsReference: isReference,
        parentSection: sectionBar,
        parentRepeats: repeats,
      }),
    );
  }

  if (isEditMode) {
    barContainers.push({
      addToParent: sectionBar,
      appendBarIndex: barIndex,
      backgroundColor: isReference ? referenceColor : sectionColor,
      barIndex,
      canUpdate: false,
      displayControls: false,
      displayIndex: getDisplayIndex(barIndex) + 'tail',
      isParent: true,
      repeats: undefined,
      type: ContainerType.sectionTail,
      sectionName: '',
      width: 0,
    });
  }
};

const processChildBar = (
  bar: ChordBar | PickingBar,
  type: ContainerType.chord | ContainerType.picking | ContainerType.reference,
  bars: Bar[],
  barContainers: BarContainer[],
  positionReference: { value: number },
  lastChordBar: ChordBar | undefined,
  referenceIndex?: number,
  options:
    | {
        firstSectionBarPosition?: undefined;
        positionReference?: undefined;
        parentIndex?: undefined;
        parentIsReference?: undefined;
        parentRepeats?: number;
        parentSection?: undefined;
      }
    | {
        firstSectionBarPosition: number;
        positionReference: { value: number };
        parentIndex: number;
        parentIsReference: boolean;
        parentRepeats?: number;
        parentSection: SectionBar;
      } = {},
) => {
  const isReference = type === ContainerType.reference;
  const { sourceIndex, referencedIndex } = referenceIndex
    ? { sourceIndex: referenceIndex, referencedIndex: bar.index }
    : { sourceIndex: bar.index };
  const isFirstInSectionBar = !!options.parentSection && bar.index === 0;
  const isLastInSectionBar = !!options.parentSection && bar.index === bars.length - 1;

  barContainers.push({
    backgroundColor: options.parentSection
      ? options.parentIsReference
        ? referenceColor
        : sectionColor
      : isReference
      ? referenceColor
      : 'white',
    canUpdate: isReference ? false : !options.parentIsReference,
    displayControls: !options.parentSection || !options.parentIsReference,
    displayIndex: getDisplayIndex(sourceIndex, {
      parentIndex: options.parentIndex,
      referencedIndex,
    }),
    omitRhythm: bar.type === BarType.chord && bar.rhythmIndex === lastChordBar?.rhythmIndex,
    barIndex: bar.index,
    position: positionReference.value++,
    renderedBar: bar,
    repeats: isFirstInSectionBar && options.parentRepeats ? options.parentRepeats : bar.repeats,
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
  });
};

export const barsToBarContainers = (
  bars: Bar[],
  isEditMode: boolean,
  options:
    | {
        firstSectionBarPosition?: undefined;
        positionReference?: undefined;
        parentIndex?: undefined;
        parentIsReference?: undefined;
        parentRepeats?: number;
        parentSection?: undefined;
      }
    | {
        firstSectionBarPosition: number;
        positionReference: { value: number };
        parentIndex: number;
        parentIsReference: boolean;
        parentRepeats?: number;
        parentSection: SectionBar;
      } = {},
): BarContainer[] => {
  const positionReference = options.positionReference || { value: 0 };
  const { barContainers } = bars.reduce<{
    barContainers: BarContainer[];
    lastChordBar: ChordBar | undefined;
  }>(
    (reduced, bar) => {
      const nextBarContainers = [...reduced.barContainers];
      let nextChordBar = reduced.lastChordBar;

      if (bar.type === BarType.chord || bar.type === BarType.picking) {
        processChildBar(
          bar,
          bar.type === BarType.chord ? ContainerType.chord : ContainerType.picking,
          bars,
          nextBarContainers,
          positionReference,
          reduced.lastChordBar,
          undefined,
          options,
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
          processChildBar(
            referencedBar,
            ContainerType.reference,
            bars,
            nextBarContainers,
            positionReference,
            reduced.lastChordBar,
            bar.index,
            options,
          );
        } else {
          processParentBar(
            nextBarContainers,
            isEditMode,
            bar.index,
            referencedBar,
            positionReference,
            ContainerType.sectionReference,
            bar.repeats,
          );
        }

        if (referencedBar.type === BarType.chord) {
          nextChordBar = referencedBar;
        }
      } else {
        processParentBar(
          nextBarContainers,
          isEditMode,
          bar.index,
          bar,
          positionReference,
          ContainerType.section,
          bar.repeats,
        );
      }

      return {
        barContainers: nextBarContainers,
        lastChordBar: nextChordBar,
      };
    },
    { barContainers: [], lastChordBar: undefined },
  );

  return barContainers;
};
