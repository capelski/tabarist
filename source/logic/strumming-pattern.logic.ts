import { CompassType, framesNumberDefault } from '../constants';
import { StrummingPattern, Tab } from '../types';

export const createStrummingPattern = (index: number): StrummingPattern => ({
  frames: Array.from({ length: framesNumberDefault }, (_, index) => ({ index, value: '' })),
  framesNumber: framesNumberDefault,
  index,
});

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
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index !== sPatternIndex
        ? sPattern
        : {
            ...sPattern,
            frames: Array.from(
              { length: framesNumber },
              (_, index) => sPattern.frames[index] ?? '',
            ),
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
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index !== sPatternIndex
        ? sPattern
        : {
            ...sPattern,
            frames: sPattern.frames.map((frame) => {
              return frame.index !== frameIndex ? frame : { ...frame, value };
            }),
          };
    }),
  };
};
