import { DiminishedBar } from './diminished-bar.type';
import { DiminishedRhythm } from './diminished-rhythm.type';
import { DiminishedSection } from './diminished-section.type';

export type DiminishedTab = {
  backingTrack: string | undefined;
  bars: DiminishedBar[];
  capo: number | undefined;
  id: string;
  ownerId: string;
  rhythms: DiminishedRhythm[];
  sections: DiminishedSection[];
  tempo: number | undefined;
  title: string;
  /** Used to match text via Firestore queries.
   * Contains all the possible combinations of words in the title */
  titleWords: string[];
};
