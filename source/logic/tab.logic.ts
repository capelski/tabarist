import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Bar, Tab } from '../types';
import { createIndexedValuesArray } from './indexed-value.logic';
import { createStrummingPattern } from './strumming-pattern.logic';

export const addBarToTab = (tab: Tab, newBar: Bar): Tab => {
  if (tab.bars.length === 0) {
    return {
      ...tab,
      bars: [newBar],
    };
  }

  const nextBars = tab.bars.reduce((reduced, bar) => {
    const isLastBar = bar.index === tab.bars.length - 1;

    const nextBar: Bar = {
      ...bar,
      index: getIndexIncrease(bar.index, newBar.index),
      ...(bar.type === BarType.reference
        ? {
            barIndex: getIndexIncrease(bar.barIndex, newBar.index),
          }
        : {}),
    };

    return [
      ...reduced,
      ...(bar.index < newBar.index
        ? isLastBar
          ? [nextBar, newBar]
          : [nextBar]
        : bar.index === newBar.index
        ? [newBar, nextBar]
        : [nextBar]),
    ];
  }, []);

  return {
    ...tab,
    bars: nextBars,
  };
};

export const addStrummingPatternToTab = (tab: Tab, spIndex: number): Tab => {
  const sPattern = createStrummingPattern(spIndex);

  return {
    ...tab,
    strummingPatterns: [...tab.strummingPatterns, sPattern],
    bars:
      tab.strummingPatterns.length > 0
        ? tab.bars
        : tab.bars.map((bar) => {
            return bar.type !== BarType.chord || bar.sPatternIndex !== undefined
              ? bar
              : {
                  ...bar,
                  sPatternIndex: sPattern.index,
                  frames: createIndexedValuesArray(sPattern.framesNumber, ''),
                };
          }),
  };
};

export const createTab = (): Tab => ({
  bars: [],
  id: nanoid(),
  strummingPatterns: [],
  title: 'Unnamed tab',
});

export const getIndexDecrease = (
  currentIndex: number,
  deletionIndex: number,
  deletedCount: number,
) => {
  return currentIndex < deletionIndex ? currentIndex : currentIndex - deletedCount;
};

export const getIndexIncrease = (currentIndex: number, insertionIndex: number) => {
  return currentIndex < insertionIndex ? currentIndex : currentIndex + 1;
};

export const removeBarFromTab = (tab: Tab, deletionIndex: number): Tab => {
  const { nextBars } = tab.bars.reduce(
    (reduced, bar) => {
      if (
        bar.index === deletionIndex ||
        (bar.type === BarType.reference && bar.barIndex === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          nextBars: reduced.nextBars,
        };
      }

      const nextBar: Bar = {
        ...bar,
        index: getIndexDecrease(bar.index, deletionIndex, reduced.deletedCount),
        ...(bar.type === BarType.reference
          ? {
              barIndex: getIndexDecrease(bar.barIndex, deletionIndex, reduced.deletedCount),
            }
          : {}),
      };

      return {
        deletedCount: reduced.deletedCount,
        nextBars: [...reduced.nextBars, nextBar],
      };
    },
    { deletedCount: 0, nextBars: [] },
  );

  return {
    ...tab,
    bars: nextBars,
  };
};

export const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};
