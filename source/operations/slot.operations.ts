import { SlotType } from '../constants';
import { BlockSlot, DiminishedSlot, Slot, ValueSlot } from '../types';

const augmentSlot = (diminishedSlot: DiminishedSlot, index: number): Slot => {
  return typeof diminishedSlot === 'string'
    ? { index, type: SlotType.value, value: diminishedSlot }
    : { index, type: SlotType.block, slots: Object.values(diminishedSlot).map(augmentSlot) };
};

const copyStructure = (baseSlots: Slot[], targetSlots: Slot[]): Slot[] => {
  return baseSlots.map((baseSlot) => {
    const targetSlot: Slot | undefined = targetSlots[baseSlot.index];
    const targetSlotValue = targetSlot ? getNextSlotValue(targetSlot) : '';
    const targetSlotBlocks =
      targetSlot && targetSlot.type === SlotType.block ? targetSlot.slots : [];

    return baseSlot.type === SlotType.value
      ? createValueSlot(baseSlot.index, targetSlotValue)
      : createBlockSlot(baseSlot.index, copyStructure(baseSlot.slots, targetSlotBlocks));
  });
};

const createBlockSlot = (index: number, nestedSlots: Slot[]): BlockSlot => {
  return {
    index,
    slots: nestedSlots,
    type: SlotType.block,
  };
};

const createSlots = (size: number, baseSlots: Slot[] = []): Slot[] => {
  return Array.from({ length: size }, (_, index) => {
    return baseSlots[index] ?? createValueSlot(index, '');
  });
};

const createValueSlot = (index: number, value: string): ValueSlot => {
  return {
    index: index,
    type: SlotType.value,
    value,
  };
};

const diminishSlot = (slot: Slot): DiminishedSlot => {
  const { index, ...rest } = slot;
  return rest.type === SlotType.value
    ? rest.value
    : rest.slots.reduce((reduced, slot) => {
        return { ...reduced, [slot.index]: diminishSlot(slot) };
      }, {});
};

const getSlotLength = (slot: Slot): number => {
  return slot.type === SlotType.value
    ? slot.value.length
    : slot.slots.reduce((reduced, nestedSlot) => {
        return reduced + getSlotLength(nestedSlot);
      }, 0);
};

const getNextSlotValue = (previousSlot: Slot): ValueSlot['value'] => {
  return previousSlot.type === SlotType.value
    ? previousSlot.value
    : getNextSlotValue(previousSlot.slots[0]);
};

const setSlotSize = (slots: Slot[], size: number, indexesPath: number[]): Slot[] => {
  if (indexesPath.length === 0) {
    // Rebasing the number of beats in the rhythm/picking bar
    return createSlots(size, slots);
  }

  return slots.map((slot) => {
    const [currentIndex, ...otherIndexes] = indexesPath;
    if (slot.index !== currentIndex) {
      return slot;
    }

    if (otherIndexes.length > 0) {
      if (slot.type === SlotType.value) {
        return slot;
      }
      return createBlockSlot(slot.index, setSlotSize(slot.slots, size, otherIndexes));
    }

    return size === 1
      ? createValueSlot(slot.index, getNextSlotValue(slot))
      : createBlockSlot(
          slot.index,
          Array.from({ length: size }, (_, nestedIndex) => {
            return slot.type === SlotType.value
              ? createValueSlot(nestedIndex, nestedIndex === 0 ? slot.value : '')
              : slot.slots[nestedIndex] ?? createValueSlot(nestedIndex, '');
          }),
        );
  });
};

const setSlotValue = (slots: Slot[], value: string, indexesPath: number[]): Slot[] => {
  return slots.map((slot) => {
    const [currentIndex, ...otherIndexes] = indexesPath;
    if (slot.index !== currentIndex) {
      return slot;
    }

    if (otherIndexes.length > 0) {
      if (slot.type === SlotType.value) {
        return slot;
      }
      return createBlockSlot(slot.index, setSlotValue(slot.slots, value, otherIndexes));
    }

    return createValueSlot(slot.index, value);
  });
};

export const slotOperations = {
  augmentSlot,

  copyStructure,

  createBlockSlot,

  createValueSlot,

  createSlots,

  diminishSlot,

  getSlotLength,

  setSlotSize,

  setSlotValue,
};
