import { Compass } from './compass.type';
import { StrummingPattern } from './strumming-pattern.type';

export type Tab = {
  compasses: Compass[];
  id: string;
  strummingPatterns: StrummingPattern[];
  title: string;
};
