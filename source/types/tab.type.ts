import { Bar } from './bar.type';
import { Section } from './section.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = {
  bars: Bar[];
  id: string;
  sections: Section[];
  strummingPatterns: StrummingPattern[];
  title: string;
};
