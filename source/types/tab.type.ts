import { Bar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { PositionOperation } from './position-operation.type';
import { Rhythm } from './rhythm.type';

export type Tab = Omit<DiminishedTab, 'bars' | 'rhythms' | 'sections'> & {
  bars: Bar[];
  copying: PositionOperation | undefined;
  moving: PositionOperation | undefined;
  rhythms: Rhythm[];
};
