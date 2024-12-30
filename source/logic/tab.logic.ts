import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Bar, Tab } from '../types';
import { barService } from './bar.logic';
import { sectionService } from './section.logic';
import { sPatternService } from './strumming-pattern.logic';

const addBar = (tab: Tab, newBar: Bar): Tab => {
  return {
    ...tab,
    bars: barService.addBar(tab.bars, newBar),
  };
};

const addSection = (tab: Tab): Tab => {
  const section = sectionService.create(tab.sections.length);

  return {
    ...tab,
    sections: [...tab.sections, section],
  };
};

const addStrummingPattern = (tab: Tab): Tab => {
  const sPattern = sPatternService.create(tab.strummingPatterns.length);

  return {
    ...tab,
    strummingPatterns: [...tab.strummingPatterns, sPattern],
    bars: barService.setStrummingPattern(tab.bars, sPattern, undefined),
    sections: tab.sections.map((section) => ({
      ...section,
      bars: barService.setStrummingPattern(section.bars, sPattern, undefined),
    })),
  };
};

const changeSection = (tab: Tab, barIndex: number, sectionIndex: number): Tab => {
  return {
    ...tab,
    bars: tab.bars.map((bar) => {
      return bar.type === BarType.section && bar.index === barIndex
        ? {
            ...bar,
            sectionIndex,
          }
        : bar;
    }),
  };
};

const create = (): Tab => ({
  bars: [],
  id: nanoid(),
  sections: [],
  strummingPatterns: [],
  title: 'Unnamed tab',
});

const rebaseChordBar = (tab: Tab, barIndex: number, sPatternIndex: number): Tab => {
  const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
  if (!sPattern) {
    return tab;
  }

  return {
    ...tab,
    bars: barService.rebaseChordBar(tab.bars, barIndex, sPattern),
  };
};

const rebasePickingBar = (tab: Tab, barIndex: number, framesNumber: number): Tab => {
  return {
    ...tab,
    bars: barService.rebasePickingBar(tab.bars, barIndex, framesNumber),
  };
};

const removeBar = (tab: Tab, deletionIndex: number): Tab => {
  return {
    ...tab,
    bars: barService.removeBar(tab.bars, deletionIndex),
  };
};

const renameSection = (tab: Tab, sectionIndex: number, name: string): Tab => {
  return {
    ...tab,
    sections: tab.sections.map((section) => {
      return section.index === sectionIndex ? { ...section, name } : section;
    }),
  };
};

const renameStrummingPattern = (tab: Tab, sPatternIndex: number, name: string): Tab => {
  return {
    ...tab,
    strummingPatterns: tab.strummingPatterns.map((sPattern) => {
      return sPattern.index === sPatternIndex ? { ...sPattern, name } : sPattern;
    }),
  };
};

const updateChordFrame = (tab: Tab, barIndex: number, frameIndex: number, value: string): Tab => {
  return {
    ...tab,
    bars: barService.updateChordFrame(tab.bars, barIndex, frameIndex, value),
  };
};

const updatePickingFrame = (
  tab: Tab,
  barIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return {
    ...tab,
    bars: barService.updatePickingFrame(tab.bars, barIndex, frameIndex, stringIndex, value),
  };
};

const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};

export const tabService = {
  addBar,
  addSection,
  addStrummingPattern,
  changeSection,
  create,
  rebaseChordBar,
  rebasePickingBar,
  removeBar,
  renameSection,
  renameStrummingPattern,
  updateChordFrame,
  updatePickingFrame,
  updateTitle,
};
