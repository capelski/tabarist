import { framesNumberDefault } from '../constants';
import { StrummingPattern, Tab } from '../types';
import { barService } from './bar.logic';
import { createIndexedValuesArray } from './indexed-value.logic';

const create = (index: number): StrummingPattern => ({
  frames: createIndexedValuesArray(framesNumberDefault, ''),
  framesNumber: framesNumberDefault,
  index,
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
    bars: barService.setStrummingPattern(tab.bars, nextStrummingPattern, sPatternIndex),
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index !== sPatternIndex ? sPattern : nextStrummingPattern;
    }),
    sections: tab.sections.map((section) => ({
      ...section,
      bars: barService.setStrummingPattern(section.bars, nextStrummingPattern, sPatternIndex),
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

export const sPatternService = {
  create,
  rebase,
  update,
};
