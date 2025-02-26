import { BarContainer } from './bar-container.type';
import { Bar, ChordBar, PickingBar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { PositionOperation } from './position-operation.type';
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
  copying: PositionOperation | undefined;
  moving: PositionOperation | undefined;
  rhythms: Rhythm[];
  sections: Section[];
};
