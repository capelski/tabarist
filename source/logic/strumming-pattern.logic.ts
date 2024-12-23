import { CompassType, framesNumberDefault } from '../constants';
import { StrummingPattern, Tab } from '../types';
import { createIndexedValuesArray } from './indexed-value.logic';

export const createStrummingPattern = (index: number): StrummingPattern => ({
  frames: createIndexedValuesArray(framesNumberDefault, ''),
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
            frames: createIndexedValuesArray(
              framesNumber,
              (index) => compass.frames[index]?.value ?? '',
            ),
          };
    }),
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index !== sPatternIndex
        ? sPattern
        : {
            ...sPattern,
            frames: createIndexedValuesArray(
              framesNumber,
              (index) => sPattern.frames[index]?.value ?? '',
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
