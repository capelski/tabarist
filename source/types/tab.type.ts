import { Bar } from './bar.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = {
  bars: Bar[];
  id: string;
  strummingPatterns: StrummingPattern[];
  title: string;
};
