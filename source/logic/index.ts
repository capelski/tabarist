import { nanoid } from 'nanoid';
import { CompassType, editIndexDefault, framesNumberDefault } from '../constants';
import {
  ChordCompass,
  Compass,
  CompassReference,
  PickingCompass,
  PickingFrame,
  StrummingPattern,
  Tab,
} from '../types';

export * from './local-storage';
export * from './routes';

export const addCompassToTab = (tab: Tab, newCompass: Compass): Tab => {
  if (tab.compasses.length === 0) {
    return {
      ...tab,
      compasses: [newCompass],
    };
  }

  const nextCompasses = tab.compasses.reduce((reduced, compass) => {
    const isLastCompass = compass.index === tab.compasses.length;

    const nextCompass: Compass = {
      ...compass,
      index: getIndexIncrease(compass.index, newCompass.index),
      ...(compass.type === CompassType.reference
        ? {
            reference: getIndexIncrease(compass.reference, newCompass.index),
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
    editIndex:
      tab.editIndex === editIndexDefault
        ? tab.editIndex
        : getIndexIncrease(tab.editIndex, newCompass.index),
  };
};

export const addStrummingPatternToTab = (tab: Tab, strummingPattern: StrummingPattern): Tab => {
  return {
    ...tab,
    strummingPatterns: [...tab.strummingPatterns, strummingPattern],
    compasses:
      tab.strummingPatterns.length > 0
        ? tab.compasses
        : tab.compasses.map((compass) => {
            return compass.type !== CompassType.chord || compass.strummingPatternIndex !== undefined
              ? compass
              : {
                  ...compass,
                  strummingPatternIndex: strummingPattern.index,
                  frames: Array.from({ length: strummingPattern.framesNumber }, () => ''),
                };
          }),
  };
};

export const arrayIndexToCompassIndex = (arrayIndex: number) => arrayIndex + 1;

export const compassIndexToArrayIndex = (compassIndex: number) => compassIndex - 1;

export const createChordCompass = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordCompass => ({
  index,
  frames: Array.from({ length: strummingPattern?.framesNumber ?? 0 }, () => ''),
  strummingPatternIndex: strummingPattern?.index,
  type: CompassType.chord,
});

export const createCompassReference = (compass: Compass): CompassReference => ({
  index: compass.index + 1,
  reference: compass.type === CompassType.reference ? compass.reference : compass.index,
  type: CompassType.reference,
});

export const createPickingCompass = (index: number): PickingCompass => ({
  index,
  frames: Array.from({ length: framesNumberDefault }, createPickingFrame),
  framesNumber: framesNumberDefault,
  type: CompassType.picking,
});

export const createPickingFrame = (): PickingFrame => Array.from({ length: 6 }, () => '');

export const createStrummingPattern = (index: number): StrummingPattern => ({
  frames: Array.from({ length: framesNumberDefault }, () => ''),
  framesNumber: framesNumberDefault,
  index,
});

export const createTab = (): Tab => ({
  compasses: [],
  editIndex: editIndexDefault,
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
  const { editIndex, nextCompasses } = tab.compasses.reduce(
    (reduced, compass) => {
      if (
        compass.index === deletionIndex ||
        (compass.type === CompassType.reference && compass.reference === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          editIndex: tab.editIndex === compass.index ? editIndexDefault : reduced.editIndex,
          nextCompasses: reduced.nextCompasses,
        };
      }

      const nextCompass: Compass = {
        ...compass,
        index: getIndexDecrease(compass.index, deletionIndex, reduced.deletedCount),
        ...(compass.type === CompassType.reference
          ? {
              reference: getIndexDecrease(compass.reference, deletionIndex, reduced.deletedCount),
            }
          : {}),
      };

      return {
        deletedCount: reduced.deletedCount,
        editIndex: getIndexDecrease(tab.editIndex, deletionIndex, reduced.deletedCount),
        nextCompasses: [...reduced.nextCompasses, nextCompass],
      };
    },
    { deletedCount: 0, editIndex: tab.editIndex, nextCompasses: [] },
  );

  return {
    ...tab,
    compasses: nextCompasses,
    editIndex,
  };
};

export const resetEditIndex = (tab: Tab): Tab => {
  return { ...tab, editIndex: editIndexDefault };
};

export const setEditIndex = (tab: Tab, compassIndex: number): Tab => {
  return { ...tab, editIndex: compassIndex };
};

export const updateChordCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.chord || arrayIndexToCompassIndex(cIndex) !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame, fIndex) => {
              return fIndex !== frameIndex ? frame : value;
            }),
          };
    }),
  };
};

export const updateChordCompassFrames = (
  tab: Tab,
  compassIndex: number,
  strummingPatternIndex: number,
): Tab => {
  const strummingPattern = tab.strummingPatterns.find((sp) => sp.index === strummingPatternIndex);
  if (!strummingPattern) {
    return tab;
  }

  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.chord || arrayIndexToCompassIndex(cIndex) !== compassIndex
        ? compass
        : {
            ...compass,
            strummingPatternIndex,
            frames: Array.from(
              { length: strummingPattern.framesNumber },
              (_, index) => compass.frames[index] ?? '',
            ),
          };
    }),
  };
};

export const updatePickingCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.picking ||
        arrayIndexToCompassIndex(cIndex) !== compassIndex
        ? compass
        : {
            ...compass,
            frames: compass.frames.map((frame, fIndex) => {
              return fIndex !== frameIndex
                ? frame
                : [...frame].map((string, sIndex) => {
                    return sIndex !== stringIndex ? string : value;
                  });
            }),
          };
    }),
  };
};

export const updatePickingCompassFrames = (
  tab: Tab,
  compassIndex: number,
  framesNumber: number,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.picking ||
        arrayIndexToCompassIndex(cIndex) !== compassIndex
        ? compass
        : {
            ...compass,
            frames: Array.from(
              { length: framesNumber },
              (_, index) => compass.frames[index] ?? createPickingFrame(),
            ),
            framesNumber,
          };
    }),
  };
};

export const updateStrummingPatternFrames = (
  tab: Tab,
  strummingPatternIndex: number,
  framesNumber: number,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== CompassType.chord ||
        compass.strummingPatternIndex !== strummingPatternIndex
        ? compass
        : {
            ...compass,
            frames: Array.from({ length: framesNumber }, (_, index) => compass.frames[index] ?? ''),
          };
    }),
    strummingPatterns: tab.strummingPatterns.map((sp, spIndex) => {
      return arrayIndexToCompassIndex(spIndex) !== strummingPatternIndex
        ? sp
        : {
            ...sp,
            frames: Array.from({ length: framesNumber }, (_, index) => sp.frames[index] ?? ''),
            framesNumber,
          };
    }),
  };
};

export const updateStrummingPatternValue = (
  tab: Tab,
  strummingPatternIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    strummingPatterns: tab.strummingPatterns.map((sp, spIndex) => {
      return arrayIndexToCompassIndex(spIndex) !== strummingPatternIndex
        ? sp
        : {
            ...sp,
            frames: sp.frames.map((frame, fIndex) => {
              return fIndex !== frameIndex ? frame : value;
            }),
          };
    }),
  };
};

export const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};
