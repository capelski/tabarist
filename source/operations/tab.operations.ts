import { User } from 'firebase/auth';
import { nanoid } from 'nanoid';
import { getTitleWords } from '../common';
import { BarType, NonReferenceBarType } from '../constants';
import {
  Bar,
  BarBase,
  BarContainer,
  ChordBar,
  DiminishedTab,
  NonSectionBar,
  PickingBar,
  Rhythm,
  Section,
  Tab,
} from '../types';
import { barOperations } from './bar.operations';
import { getIndexDecrease } from './indexed-value.operations';
import { rhythmOperations } from './rhythm.operations';
import { sectionOperations } from './section.operations';

const getNextActiveSlot = (
  barContainers: BarContainer[],
  startingPosition: number,
  repeats?: number,
): Tab['activeSlot'] | undefined => {
  return barContainers
    .slice(startingPosition)
    .reduce<Tab['activeSlot'] | undefined>((reduced, barContainer) => {
      return (
        reduced ||
        (barContainer.renderedBar
          ? {
              barContainer: barContainer as BarContainer<ChordBar | PickingBar>,
              repeats: repeats ?? barContainer.originalBar.repeats ?? 0,
              slotIndex: 0,
            }
          : undefined)
      );
    }, undefined);
};

const applyBarsOperation = (
  tab: Tab,
  barsModifier: <TBar extends Bar | NonSectionBar>(bars: TBar[]) => TBar[],
  inSection?: Section,
): Tab => {
  return inSection
    ? {
        ...tab,
        copying: undefined,
        moving: undefined,
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
        copying: undefined,
        moving: undefined,
        bars: barsModifier(tab.bars),
      };
};

export const tabOperations = {
  addBar: (tab: Tab, index: number, type: NonReferenceBarType, inSection?: Section): Tab => {
    let nextTab = { ...tab };

    if (type === BarType.chord && tab.rhythms.length === 0) {
      nextTab.rhythms = [rhythmOperations.create(0)];
    } else if (type === BarType.section && tab.sections.length === 0) {
      nextTab.sections = [sectionOperations.create(0)];
    }

    return applyBarsOperation(
      nextTab,
      (bars) => {
        const newBar =
          type === BarType.chord
            ? barOperations.createChordBar(index, nextTab.rhythms[0])
            : type === BarType.picking
            ? barOperations.createPickingBar(index)
            : barOperations.createSectionBar(index, nextTab.sections[0]);

        return barOperations.addBar(bars, newBar as any);
      },
      inSection,
    );
  },

  addRhythm: (tab: Tab): Tab => {
    const rhythm = rhythmOperations.create(tab.rhythms.length);

    return {
      ...tab,
      rhythms: [...tab.rhythms, rhythm],
    };
  },

  addSection: (tab: Tab): Tab => {
    const section = sectionOperations.create(tab.sections.length);

    return {
      ...tab,
      sections: [...tab.sections, section],
    };
  },

  augmentTab: (diminishedTab: DiminishedTab): Tab => {
    return {
      ...diminishedTab,
      activeSlot: undefined,
      bars: diminishedTab.bars.map(barOperations.augmentBar),
      copying: undefined,
      moving: undefined,
      rhythms: diminishedTab.rhythms.map(rhythmOperations.augmentRhythm),
      sections: diminishedTab.sections.map((section, index) => {
        return {
          ...section,
          bars: section.bars.map(barOperations.augmentBar),
          index,
        };
      }),
    };
  },

  cancelPositionOperation: (tab: Tab): Tab => {
    return {
      ...tab,
      copying: undefined,
      moving: undefined,
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

  copyBarEnd: (tab: Tab, endIndex: number, inSection?: Section): Tab => {
    if (!tab.copying || !sectionOperations.isOperationInSection(tab.copying, inSection)) {
      return tab;
    }

    const { copying } = tab;
    const nextTab = { ...tab, copying: undefined };

    return applyBarsOperation(
      nextTab,
      (bars) => {
        const targetBar = bars[copying.startIndex];
        const newBar =
          targetBar.type === BarType.section
            ? barOperations.createSectionBar(
                endIndex,
                tab.sections.find((s) => targetBar.sectionIndex === s.index)!,
              )
            : barOperations.createReferenceBar(targetBar, endIndex);
        return barOperations.addBar(bars, newBar as any);
      },
      inSection,
    );
  },

  copyBarStart: (tab: Tab, startIndex: number, sectionIndex: number | undefined): Tab => {
    return {
      ...tab,
      copying: {
        sectionIndex,
        startIndex,
      },
    };
  },

  create: (ownerId: User['uid']): Tab => {
    return {
      backingTrack: undefined,
      activeSlot: undefined,
      bars: [],
      capo: undefined,
      copying: undefined,
      id: nanoid(),
      moving: undefined,
      ownerId,
      rhythms: [],
      sections: [],
      tempo: undefined,
      title: 'Unnamed tab',
      titleWords: ['unnamed', 'tab'],
    };
  },

  diminishTab: (tab: Tab): DiminishedTab => {
    const { activeSlot, copying, moving, ...rest } = tab;

    return {
      ...rest,
      bars: tab.bars.map(barOperations.diminishBar),
      rhythms: tab.rhythms.map(rhythmOperations.diminishRhythm),
      sections: tab.sections.map((section) => {
        const { bars, index, ...rest } = section;

        return {
          ...rest,
          bars: bars.map(barOperations.diminishBar),
        };
      }),
    };
  },

  moveBarEnd: (tab: Tab, endIndex: number, inSection?: Section): Tab => {
    if (!tab.moving || !sectionOperations.isOperationInSection(tab.moving, inSection)) {
      return tab;
    }

    const { moving } = tab;
    const nextTab = { ...tab, movement: undefined };

    return applyBarsOperation(
      nextTab,
      (bars) => barOperations.moveBar(bars, moving.startIndex, endIndex),
      inSection,
    );
  },

  moveBarStart: (tab: Tab, startIndex: number, sectionIndex: number | undefined): Tab => {
    return {
      ...tab,
      moving: {
        sectionIndex,
        startIndex,
      },
    };
  },

  removeBar: (tab: Tab, deletionIndex: number, inSection?: Section): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.removeBar(bars, deletionIndex),
      inSection,
    );
  },

  removeRhythm: (tab: Tab, deletionIndex: number): Tab => {
    if (!rhythmOperations.canDelete(tab, deletionIndex)) {
      return tab;
    }

    const processBars = <TBar extends Bar | NonSectionBar>(bars: TBar[]): TBar[] => {
      return bars.map((bar) => {
        return bar.type === BarType.chord
          ? { ...bar, rhythmIndex: getIndexDecrease(bar.rhythmIndex, deletionIndex, 1) }
          : bar;
      });
    };

    return {
      ...tab,
      bars: processBars(tab.bars),
      sections: tab.sections.map((section) => {
        return { ...section, bars: processBars(section.bars) };
      }),
      rhythms: tab.rhythms.reduce<Rhythm[]>((reduced, rhythm) => {
        return rhythm.index === deletionIndex
          ? reduced
          : [
              ...reduced,
              {
                ...rhythm,
                index: getIndexDecrease(rhythm.index, deletionIndex, 1),
              },
            ];
      }, []),
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
      sections: tab.sections.reduce<Section[]>((reduced, section) => {
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

  renameRhythm: (tab: Tab, rhythmIndex: number, name: string): Tab => {
    return {
      ...tab,
      rhythms: tab.rhythms.map((rhythm) => {
        return rhythm.index === rhythmIndex ? { ...rhythm, name } : rhythm;
      }),
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

  resetActiveSlot: (tab: Tab): Tab => {
    return {
      ...tab,
      activeSlot: undefined,
    };
  },

  setChordBarRhythm: (tab: Tab, barIndex: number, rhythm: Rhythm, inSection?: Section): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setChordBarRhythm(bars, barIndex, rhythm),
      inSection,
    );
  },

  setChordBarSlotValue: (
    tab: Tab,
    barIndex: number,
    value: string,
    indexesPath: number[],
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setChordBarSlotValue(bars, barIndex, value, indexesPath),
      inSection,
    );
  },

  setPickingBarSlotsSize: (
    tab: Tab,
    barIndex: number,
    size: number,
    indexesPath: number[],
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setPickingBarSlotsSize(bars, barIndex, size, indexesPath),
      inSection,
    );
  },

  setPickingBarSlotValue: (
    tab: Tab,
    barIndex: number,
    stringIndex: number | 'chordSupport',
    value: string,
    indexesPath: number[],
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) =>
        barOperations.setPickingBarSlotValue(bars, barIndex, stringIndex, value, indexesPath),
      inSection,
    );
  },

  updateActiveSlot: (tab: Tab, barContainers: BarContainer[]): Tab => {
    if (tab.bars.length === 0) {
      return tab;
    }

    if (tab.activeSlot === undefined) {
      return {
        ...tab,
        activeSlot: getNextActiveSlot(barContainers, 0),
      };
    }

    const { inSectionBar, isLastInSectionBar, position, positionOfFirstBar, renderedBar } =
      tab.activeSlot.barContainer;

    const slotsLength =
      renderedBar.type === BarType.chord
        ? renderedBar.slots.length
        : renderedBar.chordSupport.length;

    const isLastSlot = tab.activeSlot.slotIndex === slotsLength - 1;
    if (!isLastSlot) {
      return {
        ...tab,
        activeSlot: {
          ...tab.activeSlot,
          slotIndex: tab.activeSlot.slotIndex + 1,
        },
      };
    }

    const hasRemainingRepeats = tab.activeSlot.repeats > 1;
    const mustRepeat = hasRemainingRepeats && (!inSectionBar || isLastInSectionBar);
    if (mustRepeat) {
      const repeatPosition = positionOfFirstBar ?? position;
      return {
        ...tab,
        activeSlot: getNextActiveSlot(barContainers, repeatPosition, tab.activeSlot.repeats - 1),
      };
    }

    const nextRepeats =
      inSectionBar && (!isLastInSectionBar || hasRemainingRepeats)
        ? tab.activeSlot.repeats
        : undefined;
    return {
      ...tab,
      activeSlot: getNextActiveSlot(barContainers, position + 1, nextRepeats),
    };
  },

  updateBackingTrack: (tab: Tab, backingTrack: string | undefined): Tab => {
    return {
      ...tab,
      backingTrack,
    };
  },

  updateCapo: (tab: Tab, capo: number | undefined): Tab => {
    return {
      ...tab,
      capo,
    };
  },

  updateRepeats: (
    tab: Tab,
    barIndex: number,
    repeats: BarBase['repeats'],
    inSection?: Section,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateRepeats(bars, barIndex, repeats),
      inSection,
    );
  },

  updateTempo: (tab: Tab, tempo: number | undefined): Tab => {
    return {
      ...tab,
      tempo,
    };
  },

  updateTitle: (tab: Tab, title: string): Tab => {
    return {
      ...tab,
      title,
      titleWords: getTitleWords(title),
    };
  },
};
