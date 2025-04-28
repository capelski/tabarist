import { Bar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { Rhythm } from './rhythm.type';

export type Tab = Omit<DiminishedTab, 'bars' | 'rhythms' | 'sections'> & {
  bars: Bar[];
  rhythms: Rhythm[];
};
