import { BarType } from '../constants';
import { tabOperations } from '../operations';
import { Section, Tab } from '../types';

export const addBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  type: BarType,
  inSection?: Section,
) => {
  const nextTab = tabOperations.addBar(tab, barIndex, type, inSection);
  updateTab(nextTab);
};

export const removeBar = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.removeBar(tab, barIndex, inSection);
  updateTab(nextTab);
};
