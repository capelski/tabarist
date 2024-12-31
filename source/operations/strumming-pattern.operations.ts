import { framesNumberDefault } from '../constants';
import { StrummingPattern, Tab } from '../types';
import { barOperations } from './bar.operations';
import { createIndexedValuesArray } from './indexed-value.operations';

const create = (index: number): StrummingPattern => ({
  frames: createIndexedValuesArray(framesNumberDefault, ''),
  framesNumber: framesNumberDefault,
  index,
  name: 'Unnamed pattern',
});

const rebase = (tab: Tab, sPatternIndex: number, framesNumber: number): Tab => {
  const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
  if (!sPattern) {
    return tab;
  }

  const nextStrummingPattern = {
    ...sPattern,
    frames: createIndexedValuesArray(framesNumber, (index) => sPattern.frames[index]?.value ?? ''),
    framesNumber,
  };

  return {
    ...tab,
    bars: barOperations.setStrummingPattern(tab.bars, nextStrummingPattern, sPatternIndex),
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index !== sPatternIndex ? sPattern : nextStrummingPattern;
    }),
    sections: tab.sections.map((section) => ({
      ...section,
      bars: barOperations.setStrummingPattern(section.bars, nextStrummingPattern, sPatternIndex),
    })),
  };
};

const update = (tab: Tab, sPatternIndex: number, frameIndex: number, value: string): Tab => {
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

export const sPatternOperations = {
  create,
  rebase,
  update,
};
