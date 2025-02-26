import { DiminishedRhythm } from './diminished-rhythm.type';
import { Slot } from './slot.type';

export type Rhythm = Omit<DiminishedRhythm, 'slots'> & {
  index: number;
  slots: Slot[];
};
