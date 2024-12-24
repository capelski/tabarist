import { CompassType, framesNumberDefault } from '../constants';
import { StrummingPattern, Tab } from '../types';

export const createStrummingPattern = (index: number): StrummingPattern => ({
  frames: Array.from({ length: framesNumberDefault }, () => ''),
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
