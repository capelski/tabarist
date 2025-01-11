import { BarType } from '../constants';
import { tabOperations } from '../operations';
import { Bar, Section, Tab } from '../types';
import { RepeatsProps } from './repeats';

export type CommonCoreProps = RepeatsProps & {
  inSection: Section | undefined;
};

export type CoreComponent = {
  additionalControls?: React.ReactNode;
  coreComponent: React.ReactNode;
};

export type CommonBarProps<TBar extends Bar> = {
  bar: TBar;
  isEditMode: boolean;
  tab: Tab;
  updateTab: (tab: Tab) => void;
  width: number;
};

export type CommonNonSectionBarProps<TBar extends Bar> = CommonBarProps<TBar> & {
  inSection: Section | undefined;
};

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

export const moveBarEnd = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  destinationIndex: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.moveBarEnd(tab, destinationIndex, inSection);
  updateTab(nextTab);
};

export const updateRepeats = (
  tab: Tab,
  updateTab: (tab: Tab) => void,
  barIndex: number,
  repeats?: number,
  inSection?: Section,
) => {
  const nextTab = tabOperations.updateRepeats(tab, barIndex, repeats, inSection);
  updateTab(nextTab);
};
