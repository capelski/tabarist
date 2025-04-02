import { activeColor, NonReferenceBarType } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, Section, Tab } from '../../types';

export type BarComponentBaseProps = {
  activeSlot: ActiveSlot | undefined;
  backgroundColor: string;
  canUpdate: boolean;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const addBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  type: NonReferenceBarType,
  inSection?: Section,
) => {
  const nextTab = tabOperations.addBar(tab, barIndex, type, inSection);
  updateTab(nextTab);
};

export const copyBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.copyBarEnd(tab, destinationIndex, inSection);
  updateTab(nextTab);
};

export const getSlotBackgroundColor = (
  activeSlot: ActiveSlot | undefined,
  position: number,
  slotIndex: number,
) => {
  return activeSlot?.barContainer.position === position && activeSlot?.slotIndex === slotIndex
    ? activeColor
    : undefined;
};

export const moveBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.moveBarEnd(tab, destinationIndex, inSection);
  updateTab(nextTab);
};
