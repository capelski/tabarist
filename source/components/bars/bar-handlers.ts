import { activeColor, NonReferenceBarType } from '../../constants';
import { tabOperations } from '../../operations';
import { ActiveSlot, SectionBar, Tab } from '../../types';

export type BarComponentBaseProps = {
  activeSlot: ActiveSlot | undefined;
  isEditMode: boolean | undefined;
  tab: Tab;
  updateTab: (tab: Tab) => void;
};

export const addBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  type: NonReferenceBarType,
  parentSection?: SectionBar,
) => {
  const nextTab = tabOperations.addBar(tab, barIndex, type, parentSection);
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
