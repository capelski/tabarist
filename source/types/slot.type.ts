import { SlotType } from '../constants';

export type BlockSlot = {
  index: number;
  slots: Slot[];
  type: SlotType.block;
};

export type ValueSlot = {
  index: number;
  type: SlotType.value;
  value: string;
};

export type Slot = BlockSlot | ValueSlot;
