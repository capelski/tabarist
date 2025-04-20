import { ContainerType } from '../constants';
import { BarContainer } from './bar-container.type';

export type ActiveSlot = {
  barContainer: BarContainer<ContainerType.chord | ContainerType.picking>;
  repeats: number;
  slotIndex: number;
};
