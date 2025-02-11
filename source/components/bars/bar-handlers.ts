import { activeColor, NonReferenceBarType } from '../../constants';
import { tabOperations } from '../../operations';
import { Section, Tab } from '../../types';

export type BarComponentBaseProps = {
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

export const getFrameBackgroundColor = (
  activeFrame: Tab['activeFrame'],
  position: number,
  frameIndex: number,
) => {
  return activeFrame?.barContainer.position === position && activeFrame?.frameIndex === frameIndex
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
