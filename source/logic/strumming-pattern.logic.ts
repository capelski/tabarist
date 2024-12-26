import { BarType, framesNumberDefault } from '../constants';
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
    bars: tab.bars.map((bar) => {
      return bar.type !== BarType.chord || bar.sPatternIndex !== sPatternIndex
        ? bar
        : {
            ...bar,
            frames: createIndexedValuesArray(
              framesNumber,
              (index) => bar.frames[index]?.value ?? '',
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
    sections: tab.sections.map((section) => ({
      ...section,
      bars: section.bars.map((bar) => {
        return bar.type !== BarType.chord || bar.sPatternIndex !== sPatternIndex
          ? bar
          : {
              ...bar,
              frames: createIndexedValuesArray(framesNumber, ''),
            };
      }),
    })),
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
