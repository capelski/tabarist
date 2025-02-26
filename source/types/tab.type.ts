import { BarContainer } from './bar-container.type';
import { Bar, ChordBar, PickingBar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { Rhythm } from './rhythm.type';
import { Section } from './section.type';

export type Tab = Omit<DiminishedTab, 'bars' | 'rhythms' | 'sections'> & {
  activeSlot:
    | undefined
    | {
        barContainer: BarContainer<ChordBar | PickingBar>;
        repeats: number;
        slotIndex: number;
      };
  bars: Bar[];
  rhythms: Rhythm[];
  sections: Section[];
};
