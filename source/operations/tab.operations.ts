import { User } from 'firebase/auth';
import { nanoid } from 'nanoid';
import { getTitleWords } from '../common';
import { BarType, NonReferenceBarType } from '../constants';
import {
  Bar,
  BarBase,
  DiminishedTab,
  NonSectionBar,
  PositionOperation,
  Rhythm,
  SectionBar,
  Tab,
} from '../types';
import { barOperations } from './bar.operations';
import { getIndexDecrease } from './indexed-value.operations';
import { rhythmOperations } from './rhythm.operations';

const applyBarsOperation = (
  tab: Tab,
  barsModifier: <TBar extends Bar | NonSectionBar>(bars: TBar[]) => TBar[],
  parentSection?: SectionBar,
): Tab => {
  return {
    ...tab,
    bars: parentSection
      ? tab.bars.map((bar) =>
          bar.type === BarType.section && bar.index === parentSection.index
            ? {
                ...bar,
                bars: barsModifier(bar.bars),
              }
            : bar,
        )
      : barsModifier(tab.bars),
  };
};

export const tabOperations = {
  addBar: (tab: Tab, index: number, type: NonReferenceBarType, parentSection?: SectionBar): Tab => {
    let nextTab = { ...tab };

    if (type === BarType.chord && tab.rhythms.length === 0) {
      nextTab.rhythms = [rhythmOperations.create(0)];
    }

    return applyBarsOperation(
      nextTab,
      (bars) => {
        const newBar =
          type === BarType.chord
            ? barOperations.createChordBar(index, nextTab.rhythms[0])
            : type === BarType.picking
            ? barOperations.createPickingBar(index)
            : barOperations.createSectionBar(index);

        return barOperations.addBar(bars, newBar as any);
      },
      parentSection,
    );
  },

  addRhythm: (tab: Tab): Tab => {
    const rhythm = rhythmOperations.create(tab.rhythms.length);

    return {
      ...tab,
      rhythms: [...tab.rhythms, rhythm],
    };
  },

  augmentTab: (diminishedTab: DiminishedTab): Tab => {
    return {
      ...diminishedTab,
      bars: diminishedTab.bars.map(barOperations.augmentBar),
      rhythms: diminishedTab.rhythms.map(rhythmOperations.augmentRhythm),
    };
  },

  copyBar: (
    tab: Tab,
    endIndex: number,
    copying: PositionOperation,
    parentSection?: SectionBar,
  ): Tab => {
    if (!barOperations.isOperationInSection(copying, parentSection)) {
      return tab;
    }

    return applyBarsOperation(
      tab,
      (bars) => {
        const targetBar = bars[copying.startIndex];
        const newBar = barOperations.createReferenceBar(targetBar, endIndex);
        return barOperations.addBar(bars, newBar as any);
      },
      parentSection,
    );
  },

  create: (ownerId: User['uid']): Tab => {
    return {
      backingTrack: undefined,
      bars: [],
      capo: undefined,
      id: nanoid(),
      ownerId,
      rhythms: [],
      tempo: undefined,
      title: 'Unnamed tab',
      titleWords: ['unnamed', 'tab', 'unnamed tab', 'tab unnamed'],
    };
  },

  diminishTab: (tab: Tab): DiminishedTab => {
    return {
      ...tab,
      bars: tab.bars.map(barOperations.diminishBar),
      rhythms: tab.rhythms.map(rhythmOperations.diminishRhythm),
    };
  },

  moveBar: (
    tab: Tab,
    endIndex: number,
    moving: PositionOperation,
    parentSection?: SectionBar,
  ): Tab => {
    if (!barOperations.isOperationInSection(moving, parentSection)) {
      return tab;
    }

    return applyBarsOperation(
      tab,
      (bars) => barOperations.moveBar(bars, moving.startIndex, endIndex),
      parentSection,
    );
  },

  removeBar: (tab: Tab, deletionIndex: number, parentSection?: SectionBar): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.removeBar(bars, deletionIndex),
      parentSection,
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
          : bar.type === BarType.section
          ? {
              ...bar,
              bars: processBars(bar.bars),
            }
          : bar;
      });
    };

    return {
      ...tab,
      bars: processBars(tab.bars),
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
      bars: tab.bars.map((bar) => {
        return bar.type === BarType.section && bar.index === sectionIndex ? { ...bar, name } : bar;
      }),
    };
  },

  setChordBarRhythm: (
    tab: Tab,
    barIndex: number,
    rhythm: Rhythm,
    parentSection?: SectionBar,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setChordBarRhythm(bars, barIndex, rhythm),
      parentSection,
    );
  },

  setChordBarSlotValue: (
    tab: Tab,
    barIndex: number,
    value: string,
    indexesPath: number[],
    parentSection?: SectionBar,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setChordBarSlotValue(bars, barIndex, value, indexesPath),
      parentSection,
    );
  },

  setPickingBarSlotsSize: (
    tab: Tab,
    barIndex: number,
    size: number,
    indexesPath: number[],
    parentSection?: SectionBar,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.setPickingBarSlotsSize(bars, barIndex, size, indexesPath),
      parentSection,
    );
  },

  setPickingBarSlotValue: (
    tab: Tab,
    barIndex: number,
    stringIndex: number | 'chordSupport',
    value: string,
    indexesPath: number[],
    parentSection?: SectionBar,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) =>
        barOperations.setPickingBarSlotValue(bars, barIndex, stringIndex, value, indexesPath),
      parentSection,
    );
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
    parentSection?: SectionBar,
  ): Tab => {
    return applyBarsOperation(
      tab,
      (bars) => barOperations.updateRepeats(bars, barIndex, repeats),
      parentSection,
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
