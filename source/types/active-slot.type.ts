import { BarContainer } from './bar-container.type';
import { ChordBar, PickingBar } from './bar.type';

export type ActiveSlot = {
  barContainer: BarContainer<ChordBar | PickingBar>;
  repeats: number;
  slotIndex: number;
};
