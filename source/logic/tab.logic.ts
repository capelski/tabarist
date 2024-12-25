import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Compass, Tab } from '../types';
import { createIndexedValuesArray } from './indexed-value.logic';
import { createStrummingPattern } from './strumming-pattern.logic';

export const addCompassToTab = (tab: Tab, newCompass: Compass): Tab => {
  if (tab.compasses.length === 0) {
    return {
      ...tab,
      compasses: [newCompass],
    };
  }

  const nextCompasses = tab.compasses.reduce((reduced, compass) => {
    const isLastCompass = compass.index === tab.compasses.length - 1;

    const nextCompass: Compass = {
      ...compass,
      index: getIndexIncrease(compass.index, newCompass.index),
      ...(compass.type === BarType.reference
        ? {
            compassIndex: getIndexIncrease(compass.compassIndex, newCompass.index),
          }
        : {}),
    };

    return [
      ...reduced,
      ...(compass.index < newCompass.index
        ? isLastCompass
          ? [nextCompass, newCompass]
          : [nextCompass]
        : compass.index === newCompass.index
        ? [newCompass, nextCompass]
        : [nextCompass]),
    ];
  }, []);

  return {
    ...tab,
    compasses: nextCompasses,
  };
};

export const addStrummingPatternToTab = (tab: Tab, spIndex: number): Tab => {
  const sPattern = createStrummingPattern(spIndex);

  return {
    ...tab,
    strummingPatterns: [...tab.strummingPatterns, sPattern],
    compasses:
      tab.strummingPatterns.length > 0
        ? tab.compasses
        : tab.compasses.map((compass) => {
            return compass.type !== BarType.chord || compass.sPatternIndex !== undefined
              ? compass
              : {
                  ...compass,
                  sPatternIndex: sPattern.index,
                  frames: createIndexedValuesArray(sPattern.framesNumber, ''),
                };
          }),
  };
};

export const createTab = (): Tab => ({
  compasses: [],
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

export const removeCompassFromTab = (tab: Tab, deletionIndex: number): Tab => {
  const { nextCompasses } = tab.compasses.reduce(
    (reduced, compass) => {
      if (
        compass.index === deletionIndex ||
        (compass.type === BarType.reference && compass.compassIndex === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          nextCompasses: reduced.nextCompasses,
        };
      }

      const nextCompass: Compass = {
        ...compass,
        index: getIndexDecrease(compass.index, deletionIndex, reduced.deletedCount),
        ...(compass.type === BarType.reference
          ? {
              compassIndex: getIndexDecrease(
                compass.compassIndex,
                deletionIndex,
                reduced.deletedCount,
              ),
            }
          : {}),
      };

      return {
        deletedCount: reduced.deletedCount,
        nextCompasses: [...reduced.nextCompasses, nextCompass],
      };
    },
    { deletedCount: 0, nextCompasses: [] },
  );

  return {
    ...tab,
    compasses: nextCompasses,
  };
};

export const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};
