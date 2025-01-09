import { nanoid } from 'nanoid';
import { BarType } from '../constants';
import { Bar, NonSectionBar, Section, Tab } from '../types';
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

const applyBarsOperation = (
  tab: Tab,
  barsModifier: <TBar extends Bar | NonSectionBar>(bars: TBar[]) => TBar[],
  inSection?: Section,
): Tab => {
  return inSection
    ? {
        ...tab,
        sections: tab.sections.map((section) =>
          section.index === inSection.index
            ? {
                ...section,
                bars: barsModifier(section.bars),
              }
            : section,
        ),
      }
    : {
        ...tab,
        bars: barsModifier(tab.bars),
      };
};

export const tabOperations = {
  addBar: (tab: Tab, index: number, type: BarType, inSection?: Section): Tab => {
    let nextTab = { ...tab };

    if (type === BarType.chord && tab.strummingPatterns.length === 0) {
      nextTab.strummingPatterns = [sPatternOperations.create(0)];
    } else if (type === BarType.section && tab.sections.length === 0) {
      nextTab.sections = [sectionOperations.create(0)];
    }

    const targetBars = inSection ? inSection.bars : nextTab.bars;

    const newBar =
      type === BarType.chord
        ? createChordBar(index, nextTab.strummingPatterns[0])
        : type === BarType.picking
        ? createPickingBar(index)
        : type === BarType.reference
        ? createReferenceBar(targetBars[index])
        : createSectionBar(index, nextTab.sections[0]);

    return applyBarsOperation(
      nextTab,
      (bars) => barOperations.addBar(bars, newBar as any),
      inSection,
    );
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

  rebaseChordBar: (tab: Tab, barIndex: number, sPatternIndex: number, inSection?: Section): Tab => {
    const sPattern = tab.strummingPatterns.find((sPattern) => sPattern.index === sPatternIndex);
    if (!sPattern) {
      return tab;
    }

    return applyBarsOperation(
      tab,
      (bars) => barOperations.rebaseChordBar(bars, barIndex, sPattern),
      inSection,
    );
  },

  rebasePickingBar: (
    tab: Tab,
    barIndex: number,
    framesNumber: number,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.rebasePickingBar(bars, barIndex, framesNumber),
      inSection,
    );
  },

  removeBar: (tab: Tab, deletionIndex: number, inSection?: Section): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.removeBar(bars, deletionIndex),
      inSection,
    );
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

  updateChordFrame: (
    tab: Tab,
    barIndex: number,
    frameIndex: number,
    value: string,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateChordFrame(bars, barIndex, frameIndex, value),
      inSection,
    );
  },

  updatePickingFrame: (
    tab: Tab,
    barIndex: number,
    frameIndex: number,
    stringIndex: number,
    value: string,
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updatePickingFrame(bars, barIndex, frameIndex, stringIndex, value),
      inSection,
    );
  },

  updateRepeats: (tab: Tab, barIndex: number, repeats?: number, inSection?: Section): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateRepeats(bars, barIndex, repeats),
      inSection,
    );
  },

  updateTitle: (tab: Tab, title: string): Tab => {
    return {
      ...tab,
      title,
    };
  },
};
