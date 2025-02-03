import { NavigateFunction } from 'react-router';
import { activeColor, NonReferenceBarType } from '../constants';
import { User } from '../firebase';
import { getTabRelativeUrl, tabOperations } from '../operations';
import { tabRepository } from '../repositories';
import { Section, Tab } from '../types';

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

export const createTab = async (user: User, navigate: NavigateFunction) => {
  const tab = tabOperations.create(user.uid);
  await tabRepository.set(tab, user.uid);

  navigate(getTabRelativeUrl(tab.id, true));
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
