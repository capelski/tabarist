import { DiminishedBar } from './diminished-bar.type';
import { DiminishedRhythm } from './diminished-rhythm.type';
import { DiminishedSection } from './diminished-section.type';
import { PositionOperation } from './position-operation.type';

export type DiminishedTab = {
  backingTrack: string | undefined;
  bars: DiminishedBar[];
  capo: number | undefined;
  copying: PositionOperation | undefined;
  id: string;
  moving: PositionOperation | undefined;
  ownerId: string;
  rhythms: DiminishedRhythm[];
  sections: DiminishedSection[];
  tempo: number | undefined;
  title: string;
  /** Each word contained in the title in lowercase. Used to match text via Firestore queries */
  titleWords: string[];
};
