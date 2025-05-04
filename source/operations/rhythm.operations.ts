import { BarType, slotsDefault, SlotType } from '../constants';
import { Bar, DiminishedRhythm, Rhythm, Tab } from '../types';
import { barOperations } from './bar.operations';
import { slotOperations } from './slot.operations';

export const rhythmOperations = {
  augmentRhythm: (diminishedRhythm: DiminishedRhythm, index: number): Rhythm => {
    const { slots, ...rest } = diminishedRhythm;

    return {
      ...rest,
      index,
      slots: slots.map(slotOperations.augmentSlot),
    };
  },

  canDelete: (tab: Tab, rhythmIndex: number) => {
    const isBarUsingRhythm = (bar: Bar) => {
      return (
        (bar.type === BarType.chord || bar.type === BarType.picking) &&
        bar.rhythmIndex === rhythmIndex
      );
    };

    return !tab.bars.some((bar) =>
      bar.type === BarType.section ? bar.bars.some(isBarUsingRhythm) : isBarUsingRhythm(bar),
    );
  },

  create: (index: number): Rhythm => ({
    slots: Array.from({ length: slotsDefault }, (_, index) => {
      return { index, type: SlotType.value, value: '' };
    }),
    index,
    name: 'Unnamed rhythm',
  }),

  diminishRhythm: (rhythm: Rhythm): DiminishedRhythm => {
    const { index, slots, ...rest } = rhythm;

    return {
      ...rest,
      slots: slots.map(slotOperations.diminishSlot),
    };
  },

  setSlotSize: (tab: Tab, rhythmIndex: number, size: number, indexesPath: number[]): Tab => {
    const rhythm = tab.rhythms.find((rhythm) => rhythm.index === rhythmIndex);
    if (!rhythm) {
      return tab;
    }

    return {
      ...tab,
      bars: barOperations.setBarSlotSize(tab.bars, rhythmIndex, size, indexesPath),
      rhythms: tab.rhythms.map((rhythm) => {
        return rhythm.index !== rhythmIndex
          ? rhythm
          : {
              ...rhythm,
              slots: slotOperations.setSlotSize(rhythm.slots, size, indexesPath),
            };
      }),
    };
  },

  setSlotValue: (tab: Tab, rhythmIndex: number, slotValue: string, indexesPath: number[]): Tab => {
    const rhythm = tab.rhythms.find((rhythm) => rhythm.index === rhythmIndex);
    if (!rhythm) {
      return tab;
    }

    const nextRhythm: Rhythm = {
      ...rhythm,
      slots: slotOperations.setSlotValue(rhythm.slots, slotValue, indexesPath),
    };

    return {
      ...tab,
      rhythms: tab.rhythms.map((rhythm) => {
        return rhythm.index !== rhythmIndex ? rhythm : nextRhythm;
      }),
    };
  },
};
