import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Bar, NonSectionBar, Tab } from '../types';
import {
  barOperations,
  createChordBar,
  createPickingBar,
  createReferenceBar,
  createSectionBar,
} from './bar.operations';
import { getIndexDecrease } from './indexed-value.operations';
import { sectionOperations } from './section.operations';
import { sPatternOperations } from './strumming-pattern.operations';

export const tabOperations = {
  addBar: (tab: Tab, index: number, type: BarType): Tab => {
    const nextTab = { ...tab };

    if (type === BarType.chord && tab.strummingPatterns.length === 0) {
      nextTab.strummingPatterns = [sPatternOperations.create(0)];
    } else if (type === BarType.section && tab.sections.length === 0) {
      nextTab.sections = [sectionOperations.create(0)];
    }

    const newBar =
      type === BarType.chord
        ? createChordBar(index, nextTab.strummingPatterns[0])
        : type === BarType.picking
        ? createPickingBar(index)
        : type === BarType.reference
        ? createReferenceBar(tab.bars[index])
        : createSectionBar(index, nextTab.sections[0]);

    nextTab.bars = barOperations.addBar(tab.bars, newBar);

    return nextTab;
  },

  addSection: (tab: Tab): Tab => {
    const section = sectionOperations.create(tab.sections.length);

    return {
      ...tab,
      sections: [...tab.sections, section],
    };
  },

  addStrummingPattern: (tab: Tab): Tab => {
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
  },

  changeSection: (tab: Tab, barIndex: number, sectionIndex: number): Tab => {
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
  },

  create: (): Tab => ({
    bars: [],
    id: nanoid(),
    sections: [],
    strummingPatterns: [],
    title: 'Unnamed tab',
  }),

  rebaseChordBar: (tab: Tab, barIndex: number, sPatternIndex: number): Tab => {
    const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
    if (!sPattern) {
      return tab;
    }

    return {
      ...tab,
      bars: barOperations.rebaseChordBar(tab.bars, barIndex, sPattern),
    };
  },

  rebasePickingBar: (tab: Tab, barIndex: number, framesNumber: number): Tab => {
    return {
      ...tab,
      bars: barOperations.rebasePickingBar(tab.bars, barIndex, framesNumber),
    };
  },

  removeBar: (tab: Tab, deletionIndex: number): Tab => {
    return {
      ...tab,
      bars: barOperations.removeBar(tab.bars, deletionIndex),
    };
  },

  removeSection: (tab: Tab, deletionIndex: number): Tab => {
    if (!sectionOperations.canDelete(tab, deletionIndex)) {
      return tab;
    }

    return {
      ...tab,
      bars: tab.bars.map((bar) => {
        return bar.type === BarType.section
          ? { ...bar, sectionIndex: getIndexDecrease(bar.sectionIndex, deletionIndex, 1) }
          : bar;
      }),
      sections: tab.sections.reduce((reduced, section) => {
        return section.index === deletionIndex
          ? reduced
          : [
              ...reduced,
              {
                ...section,
                index: getIndexDecrease(section.index, deletionIndex, 1),
              },
            ];
      }, []),
    };
  },

  removeSPattern: (tab: Tab, deletionIndex: number): Tab => {
    if (!sPatternOperations.canDelete(tab, deletionIndex)) {
      return tab;
    }

    const processBars = <TBar extends Bar | NonSectionBar>(bars: TBar[]): TBar[] => {
      return bars.map((bar) => {
        return bar.type === BarType.chord
          ? { ...bar, sPatternIndex: getIndexDecrease(bar.sPatternIndex, deletionIndex, 1) }
          : bar;
      });
    };

    return {
      ...tab,
      bars: processBars(tab.bars),
      sections: tab.sections.map((section) => {
        return { ...section, bars: processBars(section.bars) };
      }),
      strummingPatterns: tab.strummingPatterns.reduce((reduced, sPattern) => {
        return sPattern.index === deletionIndex
          ? reduced
          : [
              ...reduced,
              {
                ...sPattern,
                index: getIndexDecrease(sPattern.index, deletionIndex, 1),
              },
            ];
      }, []),
    };
  },

  renameSection: (tab: Tab, sectionIndex: number, name: string): Tab => {
    return {
      ...tab,
      sections: tab.sections.map((section) => {
        return section.index === sectionIndex ? { ...section, name } : section;
      }),
    };
  },

  renameStrummingPattern: (tab: Tab, sPatternIndex: number, name: string): Tab => {
    return {
      ...tab,
      strummingPatterns: tab.strummingPatterns.map((sPattern) => {
        return sPattern.index === sPatternIndex ? { ...sPattern, name } : sPattern;
      }),
    };
  },

  updateChordFrame: (tab: Tab, barIndex: number, frameIndex: number, value: string): Tab => {
    return {
      ...tab,
      bars: barOperations.updateChordFrame(tab.bars, barIndex, frameIndex, value),
    };
  },

  updatePickingFrame: (
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
  },

  updateTitle: (tab: Tab, title: string): Tab => {
    return {
      ...tab,
      title,
    };
  },
};
