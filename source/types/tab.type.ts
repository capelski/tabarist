import { Bar } from './bar.type';
import { Movement } from './movement.type';
import { Section } from './section.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = {
  bars: Bar[];
  id: string;
  movement: Movement | undefined;
  sections: Section[];
  strummingPatterns: StrummingPattern[];
  title: string;
};
