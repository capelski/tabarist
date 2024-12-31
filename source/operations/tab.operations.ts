import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Bar, Tab } from '../types';
import { barOperations } from './bar.operations';
import { sectionOperations } from './section.operations';
import { sPatternOperations } from './strumming-pattern.operations';

const addBar = (tab: Tab, newBar: Bar): Tab => {
  return {
    ...tab,
    bars: barOperations.addBar(tab.bars, newBar),
  };
};

const addSection = (tab: Tab): Tab => {
  const section = sectionOperations.create(tab.sections.length);

  return {
    ...tab,
    sections: [...tab.sections, section],
  };
};

const addStrummingPattern = (tab: Tab): Tab => {
  const sPattern = sPatternOperations.create(tab.strummingPatterns.length);

  return {
    ...tab,
    strummingPatterns: [...tab.strummingPatterns, sPattern],
    bars: barOperations.setStrummingPattern(tab.bars, sPattern, undefined),
    sections: tab.sections.map((section) => ({
      ...section,
      bars: barOperations.setStrummingPattern(section.bars, sPattern, undefined),
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
    bars: barOperations.rebaseChordBar(tab.bars, barIndex, sPattern),
  };
};

const rebasePickingBar = (tab: Tab, barIndex: number, framesNumber: number): Tab => {
  return {
    ...tab,
    bars: barOperations.rebasePickingBar(tab.bars, barIndex, framesNumber),
  };
};

const removeBar = (tab: Tab, deletionIndex: number): Tab => {
  return {
    ...tab,
    bars: barOperations.removeBar(tab.bars, deletionIndex),
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
    bars: barOperations.updateChordFrame(tab.bars, barIndex, frameIndex, value),
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
    bars: barOperations.updatePickingFrame(tab.bars, barIndex, frameIndex, stringIndex, value),
  };
};

const updateTitle = (tab: Tab, title: string): Tab => {
  return {
    ...tab,
    title,
  };
};

export const tabOperations = {
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
