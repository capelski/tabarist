import { NonSectionBar, Section, Tab } from '../types';
import { barService } from './bar.logic';

const addBar = (tab: Tab, sectionIndex: number, newBar: NonSectionBar): Tab => {
  newBar.inSectionIndex = sectionIndex;

  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.addBar(section.bars, newBar),
  }));
};

const create = (index: number): Section => {
  return {
    bars: [],
    index,
    name: 'Unnamed section',
  };
};

const modifySection = (
  tab: Tab,
  sectionIndex: number,
  sectionModifier: (section: Section) => Section,
): Tab => {
  const section = tab.sections.find((section) => section.index === sectionIndex);
  if (!section) {
    return tab;
  }

  return {
    ...tab,
    sections: tab.sections.map((section) => {
      return section.index !== sectionIndex ? section : sectionModifier(section);
    }),
  };
};

const rebaseChordBar = (
  tab: Tab,
  sectionIndex: number,
  barIndex: number,
  sPatternIndex: number,
): Tab => {
  const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
  if (!sPattern) {
    return tab;
  }

  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.rebaseChordBar(section.bars, barIndex, sPattern),
  }));
};

const rebasePickingBar = (
  tab: Tab,
  sectionIndex: number,
  barIndex: number,
  framesNumber: number,
): Tab => {
  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.rebasePickingBar(section.bars, barIndex, framesNumber),
  }));
};

const removeBar = (tab: Tab, sectionIndex: number, deletionIndex: number): Tab => {
  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.removeBar(section.bars, deletionIndex),
  }));
};

const updateChordFrame = (
  tab: Tab,
  sectionIndex: number,
  barIndex: number,
  frameIndex: number,
  value: string,
): Tab => {
  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.updateChordFrame(section.bars, barIndex, frameIndex, value),
  }));
};

const updatePickingFrame = (
  tab: Tab,
  sectionIndex: number,
  barIndex: number,
  frameIndex: number,
  stringIndex: number,
  value: string,
): Tab => {
  return modifySection(tab, sectionIndex, (section) => ({
    ...section,
    bars: barService.updatePickingFrame(section.bars, barIndex, frameIndex, stringIndex, value),
  }));
};

export const sectionService = {
  addBar,
  create,
  rebaseChordBar,
  rebasePickingBar,
  removeBar,
  updateChordFrame,
  updatePickingFrame,
};
