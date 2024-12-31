import { BarType } from '../constants';
import { Section, Tab } from '../types';
import {
  barOperations,
  createChordBar,
  createPickingBar,
  createReferenceBar,
} from './bar.operations';
import { sPatternOperations } from './strumming-pattern.operations';

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

export const sectionOperations = {
  addBar: (
    tab: Tab,
    sectionIndex: number,
    index: number,
    type: BarType.chord | BarType.picking | BarType.reference,
  ): Tab => {
    const nextTab = { ...tab };

    if (type === BarType.chord && tab.strummingPatterns.length === 0) {
      nextTab.strummingPatterns = [sPatternOperations.create(0)];
    }

    const newBar =
      type === BarType.chord
        ? createChordBar(index, nextTab.strummingPatterns[0])
        : type === BarType.picking
        ? createPickingBar(index)
        : createReferenceBar(tab.bars[index]);

    return modifySection(nextTab, sectionIndex, (section) => ({
      ...section,
      bars: barOperations.addBar(section.bars, newBar),
    }));
  },

  canDelete: (tab: Tab, sectionIndex: number) => {
    return !tab.bars.some(
      (bar) => bar.type === BarType.section && bar.sectionIndex === sectionIndex,
    );
  },

  create: (index: number): Section => {
    return {
      bars: [],
      index,
      name: 'Unnamed section',
    };
  },

  rebaseChordBar: (
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
      bars: barOperations.rebaseChordBar(section.bars, barIndex, sPattern),
    }));
  },

  rebasePickingBar: (
    tab: Tab,
    sectionIndex: number,
    barIndex: number,
    framesNumber: number,
  ): Tab => {
    return modifySection(tab, sectionIndex, (section) => ({
      ...section,
      bars: barOperations.rebasePickingBar(section.bars, barIndex, framesNumber),
    }));
  },

  removeBar: (tab: Tab, sectionIndex: number, deletionIndex: number): Tab => {
    return modifySection(tab, sectionIndex, (section) => ({
      ...section,
      bars: barOperations.removeBar(section.bars, deletionIndex),
    }));
  },

  updateChordFrame: (
    tab: Tab,
    sectionIndex: number,
    barIndex: number,
    frameIndex: number,
    value: string,
  ): Tab => {
    return modifySection(tab, sectionIndex, (section) => ({
      ...section,
      bars: barOperations.updateChordFrame(section.bars, barIndex, frameIndex, value),
    }));
  },

  updatePickingFrame: (
    tab: Tab,
    sectionIndex: number,
    barIndex: number,
    frameIndex: number,
    stringIndex: number,
    value: string,
  ): Tab => {
    return modifySection(tab, sectionIndex, (section) => ({
      ...section,
      bars: barOperations.updatePickingFrame(
        section.bars,
        barIndex,
        frameIndex,
        stringIndex,
        value,
      ),
    }));
  },
};
