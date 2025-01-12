import { Bar } from './bar.type';
import { PositionOperation } from './position-operation.type';
import { Section } from './section.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = {
  bars: Bar[];
  copying: PositionOperation | undefined;
  id: string;
  moving: PositionOperation | undefined;
  sections: Section[];
  strummingPatterns: StrummingPattern[];
  title: string;
};
