import { NonSectionBar } from './bar.type';
import { DiminishedSection } from './diminished-section.type';

export type Section = Omit<DiminishedSection, 'bars'> & {
  bars: NonSectionBar[];
  index: number;
};
