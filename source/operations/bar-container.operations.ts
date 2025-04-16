import {
  addBarWidth,
  barMinWidth,
  BarType,
  characterWidth,
  inputWidth,
  sectionNameMaxWidth,
} from '../constants';
import { Bar, BarContainer, ChordBar, PickingBar, SectionBar, Tab } from '../types';
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

const processSection = (
  tab: Tab,
  barContainers: BarContainer[],
  originalIndex: number,
  sectionBar: SectionBar,
  positionReference: { value: number },
  displayIndex: string,
  parentIndex?: string,
  positionOfFirstBar?: number,
  repeats?: number,
  isReference = false,
) => {
  barContainers.push({
    displayIndex: isReference
      ? `${getIndexDisplayValue(originalIndex)}=${getIndexDisplayValue(sectionBar.index)}`
      : displayIndex,
    isFirstInSectionBar: false,
    isLastInSectionBar: false,
    isReference,
    omitRhythm: false,
    originalBar: sectionBar,
    originalIndex,
    parentIsReference: false,
    parentSection: undefined,
    position: -1,
    positionOfFirstBar,
    renderedBar: undefined,
    repeats,
    width: Math.min(
      Math.max(
        addBarWidth + inputWidth + (sectionBar.name?.length ?? 0) * characterWidth,
        barMinWidth,
      ),
      sectionNameMaxWidth,
    ),
  });

  if (sectionBar.bars.length > 0) {
    barContainers.push(
      ...barsToBarContainers(tab, sectionBar.bars, {
        isReference,
        positionReference: positionReference,
        parentIndex,
        parentIsReference: isReference,
        parentSection: sectionBar,
        positionOfFirstBar: positionReference.value,
        repeats,
      }),
    );
  }
};

export const barsToBarContainers = (
  tab: Tab,
  bars: Bar[],
  {
    isReference,
    positionReference,
    parentIndex,
    parentIsReference,
    parentSection,
    positionOfFirstBar,
    repeats,
  }: {
    isReference?: boolean;
    positionReference?: { value: number };
    parentIndex?: string;
    parentIsReference?: boolean;
    parentSection?: SectionBar;
    positionOfFirstBar?: number;
    repeats?: number;
  } = {},
): BarContainer[] => {
  positionReference = positionReference || { value: 0 };
  const { barContainers } = bars.reduce<{
    barContainers: BarContainer[];
    lastChordBar: ChordBar | undefined;
  }>(
    (reduced, bar) => {
      const displayIndex = parentIndex
        ? `${parentIndex}.${getIndexDisplayValue(bar.index)}`
        : `${getIndexDisplayValue(bar.index)}`;
      const isFirstInSectionBar = !!parentSection && bar.index === 0;
      const isLastInSectionBar = !!parentSection && bar.index === bars.length - 1;

      const nextBarContainers = [...reduced.barContainers];
      let nextChordBar = reduced.lastChordBar;

      if (bar.type === BarType.chord || bar.type === BarType.picking) {
        nextBarContainers.push({
          displayIndex,
          isFirstInSectionBar,
          isLastInSectionBar,
          isReference: !!isReference,
          omitRhythm:
            bar.type === BarType.chord && bar.rhythmIndex === reduced.lastChordBar?.rhythmIndex,
          originalBar: bar,
          originalIndex: bar.index,
          parentIsReference,
          parentSection,
          position: positionReference.value++,
          positionOfFirstBar,
          renderedBar: bar,
          repeats: isFirstInSectionBar && repeats ? repeats : bar.repeats,
          width: getBarWidth(bar),
        });

        if (bar.type === BarType.chord) {
          nextChordBar = bar;
        }
      } else if (bar.type === BarType.reference) {
        const referencedBar = bars.find((b) => b.index === bar.barIndex) as
          | ChordBar
          | PickingBar
          | SectionBar;

        if (referencedBar.type === BarType.chord || referencedBar.type === BarType.picking) {
          nextBarContainers.push({
            displayIndex: `${displayIndex}=${
              parentIndex
                ? `${parentIndex}.${getIndexDisplayValue(referencedBar.index)}`
                : `${getIndexDisplayValue(referencedBar.index)}`
            }`,
            isFirstInSectionBar,
            isLastInSectionBar,
            isReference: true,
            omitRhythm:
              referencedBar.type === BarType.chord &&
              referencedBar.rhythmIndex === reduced.lastChordBar?.rhythmIndex,
            originalBar: bar,
            originalIndex: bar.index,
            parentIsReference,
            parentSection,
            position: positionReference.value++,
            positionOfFirstBar,
            renderedBar: referencedBar,
            repeats: isFirstInSectionBar && repeats ? repeats : bar.repeats,
            width: getBarWidth(referencedBar),
          });
        } else {
          processSection(
            tab,
            nextBarContainers,
            bar.index,
            referencedBar,
            positionReference,
            displayIndex,
            displayIndex,
            positionOfFirstBar,
            bar.repeats,
            true,
          );
        }

        if (referencedBar.type === BarType.chord) {
          nextChordBar = referencedBar;
        }
      } else {
        processSection(
          tab,
          nextBarContainers,
          bar.index,
          bar,
          positionReference,
          displayIndex,
          displayIndex,
          positionOfFirstBar,
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
