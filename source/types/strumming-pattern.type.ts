import { DiminishedStrummingPattern } from './diminished-strumming-pattern.type';
import { IndexedValue } from './indexed-value.type';

export type StrummingPattern = Omit<DiminishedStrummingPattern, 'frames'> & {
  frames: IndexedValue[];
  framesNumber: number;
  index: number;
};
