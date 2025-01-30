import { Bar } from './bar.type';
import { DiminishedTab } from './diminished-tab.type';
import { Section } from './section.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = Omit<DiminishedTab, 'bars' | 'sections' | 'strummingPatterns'> & {
  activeFrame:
    | undefined
    | {
        frameIndex: number;
        position: number;
        repeats: number;
      };
  bars: Bar[];
  sections: Section[];
  strummingPatterns: StrummingPattern[];
};
