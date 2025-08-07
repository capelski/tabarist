import { DiminishedBar } from './diminished-bar.type';
import { DiminishedRhythm } from './diminished-rhythm.type';

export type DiminishedTab = {
  backingTrack: string | undefined;
  bars: DiminishedBar[];
  capo: number | undefined;
  /** Used to identify tabs that need sitemap indexing */
  created?: number;
  id: string;
  ownerId: string;
  rhythms: DiminishedRhythm[];
  tempo: number | undefined;
  title: string;
  /** Used to match text via Firestore queries.
   * Contains all the possible combinations of words in the title */
  titleWords: string[];
  trackStart: number | undefined;
};
