import { DiminishedBar } from './diminished-bar.type';
import { DiminishedSection } from './diminished-section.type';
import { DiminishedStrummingPattern } from './diminished-strumming-pattern.type';
import { PositionOperation } from './position-operation.type';

export type DiminishedTab = {
  bars: DiminishedBar[];
  copying: PositionOperation | undefined;
  id: string;
  moving: PositionOperation | undefined;
  ownerId: string;
  sections: DiminishedSection[];
  strummingPatterns: DiminishedStrummingPattern[];
  title: string;
};
