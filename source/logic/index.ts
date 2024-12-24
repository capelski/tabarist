import { nanoid } from 'nanoid';
import { CompassType, framesNumberDefault } from '../constants';
import {
  ChordCompass,
  Compass,
  PickingCompass,
  PickingFrame,
  ReferenceCompass,
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
    const isLastCompass = compass.index === tab.compasses.length - 1;

    const nextCompass: Compass = {
      ...compass,
      index: getIndexIncrease(compass.index, newCompass.index),
      ...(compass.type === CompassType.reference
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
            return compass.type !== CompassType.chord || compass.sPatternIndex !== undefined
              ? compass
              : {
                  ...compass,
                  sPatternIndex: sPattern.index,
                  frames: Array.from({ length: sPattern.framesNumber }, () => ''),
                };
          }),
  };
};

export const createChordCompass = (
  index: number,
  strummingPattern: StrummingPattern | undefined,
): ChordCompass => ({
  index,
  frames: Array.from({ length: strummingPattern?.framesNumber ?? 0 }, () => ''),
  sPatternIndex: strummingPattern?.index,
  type: CompassType.chord,
});

export const createPickingCompass = (index: number): PickingCompass => ({
  index,
  frames: Array.from({ length: framesNumberDefault }, createPickingFrame),
  framesNumber: framesNumberDefault,
  type: CompassType.picking,
});

export const createPickingFrame = (): PickingFrame => Array.from({ length: 6 }, () => '');

export const createReferenceCompass = (compass: Compass): ReferenceCompass => ({
  index: compass.index + 1,
  compassIndex: compass.type === CompassType.reference ? compass.compassIndex : compass.index,
  type: CompassType.reference,
});

export const createStrummingPattern = (index: number): StrummingPattern => ({
  frames: Array.from({ length: framesNumberDefault }, () => ''),
  framesNumber: framesNumberDefault,
  index,
});

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
        (compass.type === CompassType.reference && compass.compassIndex === deletionIndex)
      ) {
        return {
          deletedCount: reduced.deletedCount + 1,
          nextCompasses: reduced.nextCompasses,
        };
      }

      const nextCompass: Compass = {
        ...compass,
        index: getIndexDecrease(compass.index, deletionIndex, reduced.deletedCount),
        ...(compass.type === CompassType.reference
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

export const updateChordCompass = (
  tab: Tab,
  compassIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.chord || cIndex !== compassIndex
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
  sPatternIndex: number,
): Tab => {
  const strummingPattern = tab.strummingPatterns.find((sp) => sp.index === sPatternIndex);
  if (!strummingPattern) {
    return tab;
  }

  return {
    ...tab,
    compasses: tab.compasses.map((compass, cIndex) => {
      return compass.type !== CompassType.chord || cIndex !== compassIndex
        ? compass
        : {
            ...compass,
            sPatternIndex: sPatternIndex,
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
      return compass.type !== CompassType.picking || cIndex !== compassIndex
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
      return compass.type !== CompassType.picking || cIndex !== compassIndex
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
  sPatternIndex: number,
  framesNumber: number,
): Tab => {
  return {
    ...tab,
    compasses: tab.compasses.map((compass) => {
      return compass.type !== CompassType.chord || compass.sPatternIndex !== sPatternIndex
        ? compass
        : {
            ...compass,
            frames: Array.from({ length: framesNumber }, (_, index) => compass.frames[index] ?? ''),
          };
    }),
    strummingPatterns: tab.strummingPatterns.map((sp, spIndex) => {
      return spIndex !== sPatternIndex
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
  sPatternIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    strummingPatterns: tab.strummingPatterns.map((sp, spIndex) => {
      return spIndex !== sPatternIndex
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
