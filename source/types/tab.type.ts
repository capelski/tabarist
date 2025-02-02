import { BarContainer } from './bar-container.type';
import { Bar, ChordBar, PickingBar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { Section } from './section.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = Omit<DiminishedTab, 'bars' | 'sections' | 'strummingPatterns' | 'tempo'> & {
  activeFrame:
    | undefined
    | {
        barContainer: BarContainer<ChordBar | PickingBar>;
        frameIndex: number;
        repeats: number;
      };
  bars: Bar[];
  sections: Section[];
  strummingPatterns: StrummingPattern[];
  tempo: number;
};
